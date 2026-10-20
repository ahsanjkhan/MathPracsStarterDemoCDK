### What Is This

This is the Infrastructure-as-Code of a temporary AWS test stack (`TestStack`) used as a starter demo for MathPracs.

You can learn more about MathPracs at https://mathpracs.com

### How Does It Work

This uses the power of AWS Cloud Development Kit (CDK) to create the following infrastructure:

1. AWS CodePipeline (`MathPracsStarterDemoPipeline`) with a single **Prod** stage, which deploys `TestStack` whenever a commit is pushed to `main` on either repo
2. AWS S3 Bucket (`mathpracs-starter-demo-<account-id>`), deleted along with its files when the stack is destroyed
3. AWS Lambda Function - https://github.com/ahsanjkhan/MathPracsStarterDemoLambda
4. AWS EventBridge Scheduler

### What Are The Components

AWS CodePipeline, AWS Lambda, AWS S3, AWS EventBridge Scheduler.

### How To Deploy

Pushing (or merging) a commit to `main` on this repo or [MathPracsStarterDemoLambda](https://github.com/ahsanjkhan/MathPracsStarterDemoLambda) automatically triggers the CodePipeline, which deploys the changes.

#### First-Time Setup

1. **Install Node.js** (version 20), **AWS CLI**, and **Finch** (`brew install finch && finch vm init && finch vm start`)

2. **Clone both repos side by side** in the same parent folder, since the stack packages the Lambda from `../MathPracsStarterDemoLambda`:
   ```bash
   git clone https://github.com/ahsanjkhan/MathPracsStarterDemoCDK.git
   git clone https://github.com/ahsanjkhan/MathPracsStarterDemoLambda.git
   ```

3. **Create a GitHub connection** in the AWS console (Developer Tools → Settings → Connections), approve it in GitHub for both repos, and paste its ARN into `GITHUB_CONNECTION_ARN` in `lib/mathpracs-starter-demo-pipeline-stack.ts`.

4. **Bootstrap CDK in the account** (with account creds exported):
   ```bash
   npx cdk bootstrap aws://<ACCOUNT_ID>/us-east-1
   ```

5. **Deploy the pipeline stack** (one time only):
   ```bash
   npm install
   CDK_DOCKER=finch npx cdk deploy MathPracsStarterDemoPipelineStack
   ```

After this, all future changes are deployed automatically via the pipeline.

#### Manual Deployments (Avoid if possible)
1. Make changes on feature branch.
2. Commit those changes and raise Pull Request as usual.
3. Deploy the changes directly:
   ```bash
   CDK_DOCKER=finch npx cdk deploy MathPracsStarterDemoPipelineStack/Prod/TestStack
   ```

### Useful Commands

- `CDK_DOCKER=finch npx cdk diff` - Compare deployed stack with current state
- `CDK_DOCKER=finch npx cdk synth` - Emit the synthesized CloudFormation template
- `CDK_DOCKER=finch npx cdk deploy` - Deploy with Finch Docker support
- `CDK_DOCKER=finch npx cdk destroy` - Destroy the stack, including the S3 bucket and its files
- `finch vm status` - See Finch VM Status
- `finch vm stop` - Stop Finch VM

### EventBridge Automation

The stack includes an EventBridge rule that automatically triggers the Lambda every 100 minutes to list the files in the S3 bucket.
