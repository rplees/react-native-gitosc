const CommonStyles = require('../common/CommonStyles');
const CommonComponents = require('../common/CommonComponents');
const config = require('../config');
const React = require('react-native');
const Platform = require('Platform');
const Colors = require('../common/Colors');
const OSCService = require('../service/OSCService');

const {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TextInput,
  Image,
  ScrollView,
} = React;

const OnBoardComponent = React.createClass({
  propTypes: {
    didOnBoard: React.PropTypes.func,
  },

  getInitialState() {
    return {
      username: '',
      loadingError: null,
      loading: false,
    }
  },

  submitOnBoard() {
    if (this.state.username.length == 0) return;

    this.setState({
      loadingError: null,
      loading: true,
    });

    OSCService.onBoard(this.state.username)
        .then(o => {
          this.setState({
            loading: false,
          })

          this.props.didOnBoard && this.props.didOnBoard(o);
        })
        .catch(err => {
          this.setState({
            loadingError: err,
            loading: false,
          });

          this.props.didOnBoard && this.props.didOnBoard(null, true);
        });
  },

  onNameChange(text) {
    this.setState({
      username: text,
    });
  },

  shouldComponentUpdate(nextProps, nextState) {
    const loginErr = nextState.loadingError != this.state.loadingError;
    const loading = nextState.loading != this.state.loading;

    return loginErr || loading;
  },

  render() {
    let failedDesc;
    if (this.state.loadingError) {
      failedDesc = (
        <Text
          style={{color: Colors.red}}>{this.state.loadingError.message}
        </Text>
      );
    }

    let loadingCp;
    let top = Platform.OS === 'android' ? 30 : 40;
    if (this.state.loading) {
      loadingCp = CommonComponents.renderLoadingView();
    }

    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        <View style={[styles.container, {top: top}]}>
          <Image
            style={styles.welcomeImage}
            source={require('../icons/ios/iTunesArtwork.png')}/>
          <View style={styles.loginContainer}>
            <TextInput
              autoCapitalize={'none'}
              autoCorrect={false}
              style={styles.textInput}
              returnKeyType={'done'}
              onChangeText={this.onNameChange}
              onSubmitEditing={this.submitOnBoard}
              placeholder={'osc username (NOT EMAIL!)'}
            />
            <TouchableHighlight
              style={styles.go}
              onPress={this.submitOnBoard}
              underlayColor={Colors.backGray}
              >
                <Text style={[styles.nameAndPwd, {'textAlign': 'center'}]}>
                  Go!
                </Text>
            </TouchableHighlight>
          </View>
          {loadingCp}
          {failedDesc}
        </View>
      </ScrollView>
    )
  },
});

const styles = StyleSheet.create({
  container: {
    top: 40,
    flexDirection: 'column',
    alignItems: 'center',
    height: 300,
    backgroundColor: 'white',
  },

  welcomeImage: {
    width: 150,
    height: 150,
    backgroundColor: Colors.backGray,
  },

  loginContainer: {
    flexDirection: 'row',
    margin: 30,
    height: 44,
    alignSelf: 'stretch',
    marginTop: 20,
  },

  textInput: {
    margin: 5,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.black,
    height: 30,
    alignSelf: 'stretch',
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 4,
    padding: 3,
    borderColor: Colors.borderColor,
    flex: 1,
  },

  go: {
    margin: 5,
    marginBottom: 10,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'stretch',
    borderRadius: 4,
    borderColor: Colors.borderColor,
  },

  nameAndPwd: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    width: 40,
  },
});

module.exports = OnBoardComponent
