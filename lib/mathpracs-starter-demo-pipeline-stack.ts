import * as cdk from 'aws-cdk-lib';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { MathPracsStarterDemoStage } from './mathpracs-starter-demo-stage';

const GITHUB_CONNECTION_ARN = 'arn:aws:codeconnections:us-east-1:655383751455:connection/99d3ff8b-fbda-4cbc-bc4f-90cb72b7bc4c';

export class MathPracsStarterDemoPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cdkSource = CodePipelineSource.connection('ahsanjkhan/MathPracsStarterDemoCDK', 'main', {
      connectionArn: GITHUB_CONNECTION_ARN,
      triggerOnPush: true,
    });

    const lambdaSource = CodePipelineSource.connection('ahsanjkhan/MathPracsStarterDemoLambda', 'main', {
      connectionArn: GITHUB_CONNECTION_ARN,
      triggerOnPush: true,
    });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MathPracsStarterDemoPipeline',
      pipelineType: codepipeline.PipelineType.V2,
      dockerEnabledForSynth: true,
      synth: new ShellStep('Synth', {
        input: cdkSource,
        additionalInputs: {
          '../MathPracsStarterDemoLambda': lambdaSource,
        },
        commands: [
          'npm ci',
          'npx cdk synth',
        ],
      }),
    });

    pipeline.addStage(new MathPracsStarterDemoStage(this, 'Prod'));
  }
}
