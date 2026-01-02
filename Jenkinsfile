pipeline {
    agent any

    parameters {
        string(name: 'TAG_EXPRESSION', defaultValue: '@P0', description: 'Cucumber tag expression to run (e.g. @P0, @Regression)')
    }

    environment {
        // Ensure /usr/local/bin (where docker/docker-compose usually live on macOS) is in the PATH
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
                echo 'Starting Local Environment (Host)...'
                echo 'Starting Local Environment (Host)...'
                // Ensure Appium and Emulator are running on the HOST and survive the stage
                // We use JENKINS_NODE_COOKIE to prevent Process Tree Killer from killing them
                withEnv(["JENKINS_NODE_COOKIE=dontKillMe"]) {
                    sh '''
                        # 1. Cleanup old processes to prevent conflicts
                        echo "--- Cleanup Old Processes ---"
                        # Force kill to ensure no stale locks
                        pkill -9 -f appium || true
                        pkill -9 -f emulator || true
                        pkill -9 -f qemu-system-aarch64 || true
                        sleep 5

                        # 2. Load NVM explicitly to find Node
                        # Avoid sourcing full shell profiles (like .zshrc) which may fail in non-interactive shells
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

                        # 3. Setup Android & Appium Environment
                        export ANDROID_HOME="/Users/apple/Library/Android/sdk"
                        export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
                        export APPIUM_HOME="$HOME/.appium"

                        # 4. Debug Environment again
                        echo "--- Environment Debug ---"
                        echo "User: $(whoami)"
                        echo "PATH: $PATH"
                        echo "ANDROID_HOME: $ANDROID_HOME"
                        echo "APPIUM_HOME: $APPIUM_HOME"
                        which node || echo "node still not found in PATH"
                        node -v || echo "node execution failed"
                        which emulator || echo "emulator NOT FOUND"
                        

                        # 5. Start Appium & Emulator
                        echo "--- Starting Appium & Emulator ---"
                        # We need to explicitly point Appium to the home where drivers are installed
                        nohup npx appium --address 0.0.0.0 --base-path /wd/hub --allow-cors > appium.log 2>&1 &
                        
                        # Start Emulator with -wipe-data for a fresh state
                        nohup emulator -avd Pixel_9_pro -no-snapshot-load -no-audio -no-boot-anim -wipe-data > emulator.log 2>&1 &
                        echo "Background processes started."
                        
                        # Wait for Emulator to be ready (up to 60s)
                        echo "Waiting for device to connect..."
                        timeout=60
                        counter=0
                        while [ $counter -lt $timeout ]; do
                            if adb devices | grep -q "device$"; then
                                echo "Device connected!"
                                break
                            fi
                            sleep 1
                            counter=$((counter+1))
                        done
                    '''
                    
                    // Final wait to ensure system boot is settled
                    sh 'sleep 10' 

                    echo "--- Service Status Debug ---"
                    sh 'lsof -i :4723 || echo "Appium port 4723 is NOT open"'
                    
                    echo "--- Appium Log ---"
                    sh 'cat appium.log || echo "No appium.log found"'
                    
                    echo "--- Emulator Log ---"
                    sh 'cat emulator.log || echo "No emulator.log found"'
                } 
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests inside Docker...'
                // Manually load .env from the local workspace (since it's gitignored and not in SCM)
                // This is specific to the LOCAL Jenkins setup on this machine.
                script {
                    def envFile = "/Users/apple/Desktop/wdio-appium-bdd/.env"
                    if (fileExists(envFile)) {
                        echo "Loading env vars from ${envFile}"
                        // Using set +x to hide the sourcing of sensitive variables
                        sh """
                        set +x
                        set -a
                        source '${envFile}'
                        set +a
                        set -x
                        docker compose up --build --exit-code-from test-runner test-runner
                        """
                    } else {
                        error ".env file not found at ${envFile}. Cannot run tests without credentials."
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Tearing down environment...'
            sh 'docker compose down'
            
            // Generate/Publish Allure Report if plugin is available
            // allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            
            // Archive artifacts as a fallback
            archiveArtifacts artifacts: 'allure-report/**, results/**', allowEmptyArchive: true
        }
    }
}
