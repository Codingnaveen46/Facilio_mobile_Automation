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
    }

    environment {
        PATH = "/usr/local/bin:/opt/homebrew/bin:$PATH"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment') {
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

                        export ANDROID_HOME="/Users/apple/Library/Android/sdk"
                        export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
                        export APPIUM_HOME="$HOME/.appium"

                        echo "--- Environment Debug ---"
                        whoami
                        node -v
                        which emulator

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
                            nohup emulator -avd Pixel_9_pro \
                              -no-snapshot-load \
                              -no-audio \
                              -no-boot-anim \
                              -wipe-data \
                              > emulator.log 2>&1 &

                            echo "Waiting for device..."
                            timeout=60
                            counter=0
                            while [ $counter -lt $timeout ]; do
                                adb devices | grep -q "device$" && break
                                sleep 1
                                counter=$((counter+1))
                            done
                        fi

                        echo "--- Installing App ---"
                        APP_PATH="/Users/apple/Desktop/wdio-appium-bdd/apps/android/app-workq-release-8.apk"
                        if [ -f "$APP_PATH" ]; then
                            adb install -r "$APP_PATH" || true
                        else
                            echo "APK not found"
                        fi
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests inside Docker container...'

                script {
                    def envFile = "/Users/apple/Desktop/wdio-appium-bdd/.env"

                    if (!fileExists(envFile)) {
                        error ".env file not found. Cannot continue."
                    }

                    sh """
                        set +x
                        set -a
                        source '${envFile}'
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
