#import <XCTest/XCTest.h>
#import <React/RCTBridgeModule.h>

#define CURRENT_METHOD _cmd

@interface TextileRCTBridgeTestCase : XCTestCase

@property (nonatomic, strong, readonly, nonnull) NSString *moduleName;
@property (nonatomic, strong, readonly, nullable) NSArray<id<RCTBridgeModule>> *bridgeModules;
@property (nonatomic, assign, readonly) NSTimeInterval timeout;

- (void)runTest:(nonnull SEL)selector;
- (void)runTest:(nonnull SEL)selector timeout:(NSTimeInterval)timeout;

@end
