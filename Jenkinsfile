pipeline {
    agent any

    stages {

        stage('Install dependencies') {
            steps {
                sh '''
                    set -e
                    npm ci
                '''
            }
        }

        stage('Validate project structure') {
            steps {
                sh '''
                    set -e

                    echo "Checking basic project structure..."

                    test -f package.json
                    test -d frontend
                    test -d frontend/pages || test -d src
                    test -d frontend/js || test -d src

                    find frontend -type f \( -name "*.html" -o -name "*.js" \) | grep -q .

                    echo "Project structure looks valid."
                '''
            }
        }

        stage('Lint Test js') {
            steps {
                sh '''
                    set -e
                    npm run lint
                '''
            }
        }

        stage('Package') {
            steps {
                sh '''
                    set -e
                    mkdir -p build
                    cp -r frontend build/frontend
                    tar -czf trustlens-static-build.tar.gz build
                    echo "Package created: trustlens-static-build.tar.gz"
                '''
            }
        }

        stage('Archive artifacts') {
            steps {
                archiveArtifacts artifacts: 'trustlens-static-build.tar.gz', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
