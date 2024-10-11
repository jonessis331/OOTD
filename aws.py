import boto3
import json

s3 = boto3.client('s3')
BUCKET_NAME = 'your-log-bucket'

def lambda_handler(event, context):
    log_data = json.loads(event['body'])
    file_name = f"log_{context.aws_request_id}.json"
    s3.put_object(Bucket=BUCKET_NAME, Key=file_name, Body=json.dumps(log_data))
    return {
        'statusCode': 200,
        'body': json.dumps('Log saved successfully')
    }
