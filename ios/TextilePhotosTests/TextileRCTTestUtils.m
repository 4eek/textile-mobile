#import <Foundation/Foundation.h>

NSString * const TextileReactNative = @"React Native";
NSString * const TextileLocalPackagerAddress = @"http://localhost:8081";

static BOOL TextileUsePackager = NO;

@interface TextileRCTTestUtils: NSObject

+ (void)load;
+ (void)enablePackagerIfNeeded;

@end

@implementation TextileRCTTestUtils

+ (void)load
{
  dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);

  NSURL *url = [NSURL URLWithString:TextileLocalPackagerAddress];
  NSURLRequest *request = [NSURLRequest requestWithURL:url];

  NSURLSessionConfiguration *config = [NSURLSessionConfiguration defaultSessionConfiguration];
  config.timeoutIntervalForRequest = 1.f;
  config.timeoutIntervalForResource = 1.f;

  void (^completion)(NSData *, NSURLResponse *, NSError *) = ^(NSData *data, NSURLResponse *response, NSError *error) {
    if (error) {
      dispatch_semaphore_signal(semaphore);
      return;
    }

    NSString *message = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    if ([message containsString:TextileReactNative]) {
      TextileUsePackager = YES;
    }

    dispatch_semaphore_signal(semaphore);
  };

  NSURLSession *session = [NSURLSession sessionWithConfiguration:config];
  NSURLSessionDataTask *task = [session dataTaskWithRequest:request
                                          completionHandler:completion];
  [task resume];

  dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
}

+ (void)enablePackagerIfNeeded
{
  if (TextileUsePackager) {
    setenv("CI_USE_PACKAGER", "", 1);
  }
}

@end
