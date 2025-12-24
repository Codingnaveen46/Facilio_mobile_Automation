import fs from 'fs';
import path from 'path';

export default class CleanAllureService {
  // onPrepare runs ONCE before all workers start
  onPrepare() {
    // Clean allure-results directory
    const allureDir = path.join(process.cwd(), 'allure-results');
    if (fs.existsSync(allureDir)) {
      fs.rmSync(allureDir, { recursive: true, force: true });
      console.log('🧹 Allure results cleaned before test run');
    }

    // Clean results directory (JUnit XML files)
    const resultsDir = path.join(process.cwd(), 'results');
    if (fs.existsSync(resultsDir)) {
      fs.rmSync(resultsDir, { recursive: true, force: true });
      fs.mkdirSync(resultsDir); // Recreate empty directory
      console.log('🧹 JUnit XML results cleaned before test run');
    }
  }
}
