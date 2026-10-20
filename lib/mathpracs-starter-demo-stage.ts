import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MathPracsStarterDemoStack } from './mathpracs-starter-demo-stack';

export class MathPracsStarterDemoStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);
    new MathPracsStarterDemoStack(this, 'TestStack', {
      stackName: 'TestStack',
    });
  }
}
