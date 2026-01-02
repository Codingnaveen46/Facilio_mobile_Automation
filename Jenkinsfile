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
                // Ensure Appium and Emulator are running on the HOST and survive the stage
                // We use JENKINS_NODE_COOKIE to prevent Process Tree Killer from killing them
                // We Explicitly set PATH and ANDROID_HOME to ensure commands work
                withEnv([
                    "JENKINS_NODE_COOKIE=dontKillMe",
                    "ANDROID_HOME=/Users/apple/Library/Android/sdk",
                    "PATH=/usr/local/bin:/opt/homebrew/bin:/bin:/usr/bin:/sbin:/usr/sbin:/Users/apple/Library/Android/sdk/emulator:/Users/apple/Library/Android/sdk/platform-tools:${env.PATH}"
                ]) {
                    sh '''
                        echo "--- Environment Debug ---"
                        echo "User: $(whoami)"
                        echo "PATH: $PATH"
                        which node || echo "node not found"
                        node -v || echo "node execution failed"
                        which npm || echo "npm not found"
                        which emulator || echo "emulator not found"
                        
                        echo "--- Starting Appium & Emulator ---"
                        nohup npx appium --address 0.0.0.0 --base-path /wd/hub --allow-cors > appium.log 2>&1 &
                        nohup emulator -avd Pixel_9_pro -no-snapshot-load -no-audio -no-boot-anim > emulator.log 2>&1 &
                        echo "Background processes started."
                    '''
                    
                    // Wait for emulator to be ready
                    sh 'sleep 60' 

                    echo "--- Service Status Debug ---"
                    // Debug: Check if Appium is listening (non-blocking check)
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
                sh 'docker compose up --build --exit-code-from test-runner test-runner'
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
