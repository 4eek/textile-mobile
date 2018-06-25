#import "TextileRCTBridgeTestCase.h"
#import <RCTTest/RCTTestRunner.h>
#import "TextileRCTTestUtils.m"

NSString * const TextileTestNameKey = @"testName";
NSString * const TextileTestTimeoutKey = @"testTimeout";

NSString * const TextileMissingModuleException = @"TextileMissingModuleException";
NSString * const TextileMissingModuleExceptionReason = @"You did not provide a module name. Please override the getter of the moduleName property.";

@implementation TextileRCTBridgeTestCase {
  RCTTestRunner *_runner;
}

- (void)setUp
{
  [super setUp];

  [TextileRCTTestUtils enablePackagerIfNeeded];

  _runner = RCTInitRunnerForApp(@"NativeModuleTests/IntegrationTests", [self moduleProvider], nil);
  _runner.recordMode = NO;
}

- (NSTimeInterval)timeout
{
  return 2.0;
}

- (void)runTest:(SEL)selector
{
  [self runTest:selector timeout:self.timeout];
}

- (void)runTest:(SEL)selector timeout:(NSTimeInterval)timeout
{
  NSString *name = self.moduleName;
  if (name) {
    NSDictionary *dict = @{
                           TextileTestNameKey: NSStringFromSelector(selector),
                           TextileTestTimeoutKey: @(timeout)
                           };

    [_runner runTest:_cmd module:name initialProps:dict configurationBlock:nil];
  }
  else {
    @throw [NSException exceptionWithName:TextileMissingModuleException
                                   reason:TextileMissingModuleExceptionReason
                                 userInfo:nil];
  }
}

#pragma mark - Private

- (NSArray<id<RCTBridgeModule>> *(^)(void))moduleProvider
{
  NSArray *bridges = self.bridgeModules;

  if (bridges && bridges.count > 0) {
    return ^() {
      return bridges;
    };
  }

  return nil;
}

@end
