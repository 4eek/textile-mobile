#import <Foundation/Foundation.h>
#import "TextileRCTBridgeTestCase.h"
#import "TextileNode.h"

@interface TextileNodeTestCase : TextileRCTBridgeTestCase
@end

@implementation TextileNodeTestCase
{
  id _loggingServiceMock;
}

#pragma mark - Public

- (NSString *)moduleName
{
  return @"TextileNodeTests";
}

- (NSArray<id<RCTBridgeModule>> *)bridgeModules
{
//  _loggingServiceMock = OCMClassMock([LoggingService class]);
//  LoggingBridge *loggingBridge = [[LoggingBridge alloc] initWithServiec:_loggingServiceMock];

  TextileNode *node = [[TextileNode alloc] init];

  return @[node];
}

#pragma mark - Tests

- (void)testActionA
{
//  [[[_loggingServiceMock stub] andReturn:@"A"] someValue];

  [self runTest:CURRENT_METHOD];
}

- (void)testActionB
{
//  [[[_loggingServiceMock stub] andReturn:@"B"] anotherValue];

  [self runTest:CURRENT_METHOD timeout:4.0];
}

@end
