import fs from 'fs';
import path from 'path';

export default class CleanAllureService {
  beforeSession() {
    const resultsDir = path.join(process.cwd(), 'allure-results');
    if (fs.existsSync(resultsDir)) {
      fs.rmSync(resultsDir, { recursive: true, force: true });
      console.log('🧹 Allure results cleaned before test run');
    }
  }
}
