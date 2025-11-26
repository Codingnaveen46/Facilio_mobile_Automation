# GitHub Actions CI/CD Setup Guide

## Overview
This guide explains how to configure and use GitHub Actions for automated mobile testing.

## Workflow Configuration

### What Gets Triggered?
- **Push to `main` or `develop` branch** - Automatically runs tests
- **Pull Requests to `main` or `develop`** - Validates PRs before merge
- **Manual dispatch** - Run tests on-demand via GitHub UI

### What Tests Run?
- Only **@P0 (Critical/Smoke)** tests run in CI
- Takes ~5-8 minutes total (emulator startup + tests)
- Full test suite can be run locally

---

## Setting Up GitHub Secrets

GitHub Actions needs access to your credentials. Add these as **repository secrets**:

### Step 1: Go to Repository Settings
1. Navigate to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Step 2: Add Required Secrets

Add each of these secrets (get values from your `.env` file):

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `TEST_EMAIL` | Test user email | `user@example.com` |
| `TEST_PASSWORD` | Test user password | `YourPassword123` |
| `BUGASURA_API_KEY` | Bugasura API key | `d9925801...` |
| `BUGASURA_TEAM_ID` | Bugasura team ID | `42646` |
| `BUGASURA_PROJECT_ID` | Bugasura project ID | `61276` |
| `BUGASURA_SERVER` | Bugasura server name | `facilio` |
| `BUGASURA_TESTRUN_ID` | Bugasura test run ID | `126821` |

> [!WARNING]
> **Never commit `.env` file to Git!** It should be in `.gitignore`.

---

## How to Use

### Automatic Runs
Simply push code or create a PR:
```bash
git add .
git commit -m "feat: new feature"
git push origin main
```
→ GitHub Actions will automatically run tests

### Manual Runs
1. Go to **Actions** tab in GitHub
2. Click **Android Mobile Tests** workflow
3. Click **Run workflow** button
4. Select branch and click **Run workflow**

### Viewing Results
1. Go to **Actions** tab
2. Click on the workflow run
3. View test results in the job summary
4. Download **Allure Report** artifact for detailed results

---

## Configuration Files

### `.github/workflows/android-tests.yml`
Main workflow file that:
- Sets up Android SDK and emulator (API 30)
- Installs Node.js, Appium, dependencies
- Runs P0 tests
- Generates Allure report
- Uploads artifacts

### Emulator Settings
- **API Level**: 30 (Android 11) - Most stable on GitHub runners
- **Profile**: Pixel 5
- **Features**: No window, no audio, disabled animations
- **Caching**: AVD cached for faster subsequent runs

---

## Troubleshooting

### Tests Failing in CI but Passing Locally?
**Possible causes:**
1. **Emulator version difference** - CI uses API 30, local might be different
2. **Timing issues** - CI runners are slower, increase timeouts
3. **Missing secrets** - Verify all secrets are configured

**Solutions:**
- Test locally with API 30 emulator
- Increase `waitforTimeout` in config for CI
- Check workflow logs for specific errors

### Workflow Not Triggering?
**Check:**
1. File is at `.github/workflows/android-tests.yml` (exact path)
2. YAML syntax is valid (use YAML validator)
3. Push is to `main` or `develop` branch

### Emulator Fails to Start?
**This is rare but can happen:**
- GitHub may have runner issues
- Re-run the workflow (click "Re-run jobs")
- Contact GitHub Support if persistent

---

## Cost & Limits

### GitHub Actions Free Tier
- **2,000 minutes/month** for private repos
- **Unlimited** for public repos
- Each test run takes ~8 minutes

**Monthly capacity:**
- Private repo: ~250 test runs
- Public repo: Unlimited

---

## Customization

### Run Different Test Tags
Edit `.github/workflows/android-tests.yml`:
```yaml
script: |
  npx wdio config/wdio.android.conf.ts --cucumberOpts.tagExpression="@P0 or @P1"
```

### Run on Different Branches
Edit the `on:` section:
```yaml
on:
  push:
    branches: [ main, develop, feature/* ]
```

### Change Emulator API Level
Edit the `api-level:` values (use 29, 30, or 31 for stability):
```yaml
api-level: 30  # Change to 29 or 31 if needed
```

---

## Best Practices

1. **Keep CI Fast** - Only run P0 tests (<5 min)
2. **Run Full Suite Locally** - Use CI for smoke tests
3. **Monitor Secrets** - Rotate credentials periodically
4. **Review Logs** - Check workflow logs for failures
5. **Cache Dependencies** - Workflow already caches npm and AVD

---

## Future Enhancements

### Optional: Publish Allure Report to GitHub Pages
Create `.github/workflows/publish-report.yml` to:
- Automatically publish Allure reports to GitHub Pages
- View reports at `https://<username>.github.io/<repo>/`

### Optional: Slack/Email Notifications
Add notification steps to workflow:
```yaml
- name: Notify on Failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Optional: Cloud Device Testing
Replace emulator with BrowserStack/Sauce Labs for real device testing.

---

## Summary

✅ **What You Get:**
- Automated testing on every push/PR
- Fast feedback (~8 min)
- Downloadable Allure reports
- No manual setup after initial config

✅ **What to Do:**
1. Add secrets to GitHub repository
2. Push code
3. Watch tests run automatically
4. Download reports if needed

Your CI/CD pipeline is now ready for your demo! 🚀
