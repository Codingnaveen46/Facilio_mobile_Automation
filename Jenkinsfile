pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Environment') {
            steps {
                echo 'Starting Docker environment...'
                sh 'docker-compose up -d appium'
                
                // Wait for emulator to be ready (rudimentary check or sleep)
                // In a production env, you might use a loop checking for status
                sh 'sleep 60' 
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests inside Docker...'
                // Run the test runner service; exit code from this service determines stage success
                sh 'docker-compose up --exit-code-from test-runner test-runner'
            }
        }
    }

    post {
        always {
            echo 'Tearing down environment...'
            sh 'docker-compose down'
            
            // Generate/Publish Allure Report if plugin is available
            // allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            
            // Archive artifacts as a fallback
            archiveArtifacts artifacts: 'allure-report/**, results/**', allowEmptyArchive: true
        }
    }
}
