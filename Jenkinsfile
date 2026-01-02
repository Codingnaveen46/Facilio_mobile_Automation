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
                // Ensure Appium and Emulator are running on the HOST
                // We use 'nohup' to run them in background. 
                // Note: Jenkins needs PATH access to 'appium' and 'emulator'
                
                sh 'nohup npx appium --address 0.0.0.0 --base-path /wd/hub --allow-cors > appium.log 2>&1 &'
                sh 'nohup emulator -avd Pixel_9_pro -no-snapshot-load -no-audio -no-boot-anim > emulator.log 2>&1 &'
                
                // Wait for emulator to be ready
                sh 'sleep 60' 
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
