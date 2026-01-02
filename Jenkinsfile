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
                echo 'Starting Docker environment...'
                // Debugging: Check PATH and docker availability
                sh 'echo "Current PATH: $PATH"'
                sh 'which docker || echo "docker not found in PATH"'
                sh 'docker --version || echo "docker command failed"'
                
                // Use 'docker compose' (v2) instead of 'docker-compose'
                sh 'docker compose up -d appium'
                
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
