pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    parameters {
        string(
            name: 'TAG_EXPRESSION',
            defaultValue: '@P0',
            description: 'Cucumber tag expression to run (e.g. @P0, @Regression)'
        )
        string(
            name: 'EMULATOR_NAME',
            defaultValue: 'Pixel_9_pro',
            description: 'Android Emulator AVD name'
        )
    }

    environment {
        PATH = "/usr/local/bin:/opt/homebrew/bin:$PATH"
        ANDROID_HOME = credentials('ANDROID_HOME_PATH')
        APK_PATH     = credentials('APK_PATH')
        ENV_FILE     = credentials('ENV_FILE_PATH')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment') {
            options {
                timeout(time: 15, unit: 'MINUTES')
            }
            steps {
                echo 'Starting host-level Appium & Emulator setup...'

                withEnv(["JENKINS_NODE_COOKIE=dontKillMe"]) {
                    sh '''
                        echo "--- Checking Emulator Status ---"
                        if adb devices | grep -q "device$"; then
                            echo "Emulator already running"
                            EMULATOR_RUNNING=true
                        else
                            EMULATOR_RUNNING=false
                        fi

                        if [ "$EMULATOR_RUNNING" = "false" ]; then
                            echo "--- Cleaning old processes ---"
                            pkill -9 -f appium || true
                            pkill -9 -f emulator || true
                            pkill -9 -f qemu-system-aarch64 || true
                            sleep 5
                        fi

                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

                        export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
                        export APPIUM_HOME="$HOME/.appium"

                        echo "--- Starting Appium ---"
                        if ! lsof -i :4723 > /dev/null 2>&1; then
                            nohup npx appium \
                              --address 0.0.0.0 \
                              --base-path /wd/hub \
                              --allow-cors \
                              > appium.log 2>&1 &
                            sleep 5
                        fi

                        if [ "$EMULATOR_RUNNING" = "false" ]; then
                            echo "--- Starting Emulator ---"
                            nohup emulator -avd "$EMULATOR_NAME" \
                              -no-snapshot-load \
                              -no-audio \
                              -no-boot-anim \
                              -wipe-data \
                              > emulator.log 2>&1 &

                            echo "--- Waiting for device to connect ---"
                            adb wait-for-device
                        fi

                        echo "--- Waiting for Android to fully boot ---"
                        BOOT_COMPLETED=""
                        while [ "$BOOT_COMPLETED" != "1" ]; do
                          BOOT_COMPLETED=$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\\r')
                          sleep 1
                        done

                        echo "--- Preparing Chrome (skip first-run screen) ---"
                        adb shell pm clear com.android.chrome || true
                        adb shell settings put secure user_setup_complete 1 || true
                        adb shell settings put secure device_provisioned 1 || true
                        adb shell monkey -p com.android.chrome -c android.intent.category.LAUNCHER 1 || true
                        sleep 3
                        adb shell am force-stop com.android.chrome || true

                        echo "--- Installing App ---"
                        if [ -f "$APK_PATH" ]; then
                            adb install -r "$APK_PATH" || true
                        else
                            echo "APK not found at $APK_PATH"
                        fi
                    '''
                }
            }
        }

        stage('Run Tests') {
            options {
                timeout(time: 30, unit: 'MINUTES')
            }
            steps {
                echo 'Running tests inside Docker container...'

                script {
                    if (!fileExists(env.ENV_FILE)) {
                        error ".env file not found at ${env.ENV_FILE}"
                    }

                    sh """
                        set +x
                        set -a
                        source '${ENV_FILE}'
                        set +a
                        set -x

                        docker compose up --build \
                          --exit-code-from test-runner \
                          test-runner
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Tearing down Docker environment...'
            sh 'docker compose down || true'

            echo 'Cleaning host processes...'
            sh '''
                killall -9 emulator || true
                killall -9 qemu-system-aarch64 || true
                pkill -9 -f emulator || true
                pkill -9 -f appium || true
            '''

            archiveArtifacts artifacts: 'allure-report/**, results/**', allowEmptyArchive: true
        }
    }
}
