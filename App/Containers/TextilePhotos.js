import React from 'react'
import {View, Text, Image, TouchableWithoutFeedback} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import HeaderButtons from 'react-navigation-header-buttons'
import ActionSheet from 'react-native-actionsheet'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions, { ThreadData, PhotosQueryResult } from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import style from './Styles/TextilePhotosStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'

class TextilePhotos extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const headerTitle = params.threadName === 'default' ? (
      <TouchableWithoutFeedback delayLongPress={3000} onLongPress={params.toggleVerboseUi}>
        <Image style={navStyles.headerTitleImage} source={require('../Images/TextileHeader.png')} />
      </TouchableWithoutFeedback>
    ) : params.threadName
    const headerRight = params.threadName === 'default' ? null : (
      <HeaderButtons IconComponent={Icon} iconSize={33} color="white">
        <HeaderButtons.Item title="options" iconName="ios-more" onPress={params.showActionSheet} />
      </HeaderButtons>
    )
    return {
      headerTitle,
      headerRight
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.toggleVerboseUi !== prevProps.toggleVerboseUi || this.props.threadName !== prevProps.threadName) {
      this.props.navigation.setParams({
        toggleVerboseUi: this.props.toggleVerboseUi,
        threadName: this.props.threadName,
        showActionSheet: this.showActionSheet.bind(this)
      })
    }
  }

  componentDidMount () {
    // Unload any full screen photo
    this.props.dismissPhoto()
    // Set params
    this.props.navigation.setParams({
      toggleVerboseUi: this.props.toggleVerboseUi,
      threadName: this.props.threadName,
      showActionSheet: this.showActionSheet.bind(this)
    })
  }

  onSelect = (row) => {
    return () => {
      console.log('row', row)
      console.log('this.props', this.props)
      this.props.viewPhoto(row.index, this.props.threadId)
    }
  }

  onRefresh () {
    this.props.refresh(this.props.threadId)
  }

  showActionSheet() {
    this.actionSheet.show()
  }

  handleActionSheetResponse (index: number) {
    if (index === 0) {
      this.props.invite(this.props.threadId, this.props.threadName)
    } else if (index === 1) {
      this.props.leaveThread(this.props.threadId)
    }
  }

  render () {
    return (
      <View style={style.container}>
        <PhotoGrid
          items={this.props.items}
          progressData={this.props.progressData}
          onSelect={this.onSelect}
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.props.refreshing}
          placeholderText={this.props.placeholderText}
          displayImages={this.props.displayImages}
          verboseUi={this.props.verboseUi}
        />
        <ActionSheet
          ref={o => this.actionSheet = o}
          title={this.props.threadName + ' Thread Actions'}
          options={['Invite Others', 'Leave Thread', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.handleActionSheetResponse.bind(this)}
        />
        {this.props.verboseUi &&
          <View style={style.bottomOverlay} >
            <Text style={style.overlayText}>{this.props.nodeStatus + ' | ' + this.props.queryingCameraRollStatus}</Text>
          </View>
        }
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // TODO: Can this be a selector?
  const navParams = ownProps.navigation.state.params || {}
  const defaultThread = state.threads.threads.find(thread => thread.name === 'default')
  const defaultThreadId = defaultThread ? defaultThread.id : undefined
  const threadId = navParams.id || defaultThreadId

  var items: PhotosQueryResult[] = []
  var refreshing = false
  var thread = undefined
  if (threadId) {
    const threadData: ThreadData = state.ipfs.threads[threadId] || { querying: false, items: [] }
    items = threadData.items
    refreshing = threadData.querying
    thread = state.threads.threads.find(thread => thread.id === threadId)
  }

  const threadName = thread ? thread.name : undefined

  const nodeStatus = state.ipfs.nodeState.error
    ? 'Error - ' + state.ipfs.nodeState.error.message
    : state.ipfs.nodeState.state

  const queryingCameraRollStatus = state.cameraRoll.querying ? 'querying' : 'idle'

  const placeholderText = state.ipfs.nodeState.state !== 'started'
    ? 'Wallet Status:\n' + nodeStatus
    : (threadName === 'default'
    ? 'Any new photos you take will be added to your Textile wallet.'
    : 'Share your first photo to the ' + threadName + ' thread.')
  return {
    threadId,
    threadName,
    items,
    progressData: state.uploadingImages.images,
    refreshing,
    displayImages: state.ipfs.nodeState.state === 'started',
    placeholderText,
    nodeStatus,
    queryingCameraRollStatus,
    verboseUi: state.preferences.verboseUi
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dismissPhoto: () => { dispatch(UIActions.dismissViewedPhoto()) },
    viewPhoto: (index, threadId) => { dispatch(UIActions.viewPhotoRequest(index, threadId)) },
    refresh: (threadId: string) => { dispatch(TextileNodeActions.getPhotoHashesRequest(threadId)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) },
    invite: (threadId: string, threadName: string) => { dispatch(ThreadsActions.addExternalInviteRequest(threadId, threadName)) },
    leaveThread: (threadId: string) => { dispatch(ThreadsActions.removeThreadRequest(threadId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
