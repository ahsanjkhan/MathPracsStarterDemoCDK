#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MathPracsStarterDemoPipelineStack } from '../lib/mathpracs-starter-demo-pipeline-stack';

const app = new cdk.App();
new MathPracsStarterDemoPipelineStack(app, 'MathPracsStarterDemoPipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
