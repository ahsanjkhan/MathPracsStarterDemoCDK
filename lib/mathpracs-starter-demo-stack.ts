import * as cdk from 'aws-cdk-lib';
import * as python from '@aws-cdk/aws-lambda-python-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class MathPracsStarterDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'StarterDemoBucket', {
      bucketName: `mathpracs-starter-demo-${this.account}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const listBucketFilesLambda = new python.PythonFunction(this, 'ListBucketFilesFunction', {
      functionName: 'mathpracs-starter-demo-list-bucket-files',
      runtime: lambda.Runtime.PYTHON_3_13,
      entry: '../MathPracsStarterDemoLambda/list_bucket_files',
      handler: 'lambda_handler',
      timeout: cdk.Duration.seconds(30),
      memorySize: 128,
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    bucket.grantRead(listBucketFilesLambda);

    const scheduleRule = new events.Rule(this, 'ListBucketFilesSchedule', {
      ruleName: 'mathpracs-starter-demo-list-bucket-files-schedule',
      description: 'Triggers list bucket files Lambda every 2 minutes',
      schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
    });

    scheduleRule.addTarget(new targets.LambdaFunction(listBucketFilesLambda));

    new cdk.CfnOutput(this, 'StarterDemoBucketName', {
      value: bucket.bucketName,
      description: 'S3 bucket name for the starter demo',
    });

    new cdk.CfnOutput(this, 'ListBucketFilesLambdaFunctionName', {
      value: listBucketFilesLambda.functionName,
      description: 'List bucket files Lambda function name',
    });
  }
}
