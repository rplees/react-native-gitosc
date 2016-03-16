/**
 * Created by rplees on 3/8/16.
 */
const React = require('react-native');
const Platform = require('Platform');
const Colors = require('../common/Colors');
const L = require('../common/Log');
const CommonComponents = require('../common/CommonComponents');
const SettingsCell = require('../common/SettingsCell');
const OSCService = require('../service/OSCService');
const Icon = require('react-native-vector-icons/Ionicons');

const {
    View,
    Text,
    Alert,
    StyleSheet,
    TouchableHighlight,
    Image,
    TouchableOpacity,
    ScrollView
    } = React;

const RepoDetailComponent = React.createClass({
    getInitialState() {
        return {
            isLoading:true,
            isStar:false,
            isWatch:false}
    },
    componentDidMount() {
        this.setState({
            isStar: this.props.repo.stared? true: false,
            isWatch: this.props.repo.watched? true: false,
        });

        OSCService.getProject(this.props.repo.id)
            .then(repo => {
                this.setState({
                    isStar: repo.stared? true: false,
                    isWatch: repo.watched? true: false,
                    isLoading:false,
                });
            }).catch(err => {
                this.setState({ isLoading:false,});
            });
    },
    star() {
        var repo = this.props.repo;
        var promise;
        if(this.state.isStar) {
            promise = (() => {
                OSCService.unStarProject(repo.id)
                    .then(json => {
                        this.setState({isStar: false, isLoading:false,});
                    })
                    .catch(err => {
                        this.setState({ isLoading:false,});
                    });
            });
        } else {//star
            promise = (() => {
            OSCService.starProject(repo.id)
                .then(json => {
                    this.setState({isStar: true,isLoading:false,});
                })
                .catch(err => {
                    this.setState({ isLoading:false,});
                });
            });
        }

        OSCService.checkNeedLoginWithPromise(promise, this.props.navigator);
        this.setState({isLoading:true});
    },
    watch() {
        var repo = this.props.repo;
        var promise;
        if(this.state.isWatch) {
            promise = (() => {
                OSCService.unWatchProject(repo.id)
                    .then(json => {
                        this.setState({
                            isWatch: false,
                            isLoading:false,
                        });
                    })
                    .catch(err => {
                        this.setState({ isLoading:false,});
                    });
            });
        } else {//star
            promise = (() => {
                OSCService.watchProject(repo.id)
                    .then(json => {
                        this.setState({
                            isWatch: true,
                            isLoading:false,
                        });
                    })
                    .catch(err => {
                        this.setState({ isLoading:false,});
                    });
            });
        }

        OSCService.checkNeedLoginWithPromise(promise, this.props.navigator);
        this.setState({isLoading:true});
    },
    render() {
        var repo = this.props.repo;
        let cp;
        if(this.state.isLoading) {
            cp = CommonComponents.renderLoadingView();
        }
        return(
            <ScrollView style={{padding: 5,flexDirection: "column", flex: 1,marginTop:64}}>
                <View style={{flexDirection: "column", justifyContent: "flex-start"}}>
                    {cp}
                    <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems:"center"}}>
                        <Image style={{width: 40, height:40,marginTop:5, borderRadius:8, backgroundColor:Colors.backGray}} source={{uri: repo.owner.new_portrait}} />
                        <Text style={{fontSize:16, fontWeight:'bold',color:Colors.black, marginLeft:10,}}>{repo.owner.name}</Text>
                    </View>

                    <Text style={{marginTop:5,fontSize:12, fontWeight:'bold',color:Colors.backGray}}>更新于
                        <Text style={{fontSize:11, color:Colors.backGray}}>{repo.last_push_at}</Text>
                    </Text>
                    <View style = {{marginTop:5}}>{CommonComponents.renderSepLine()}</View>
                    <Text style={{marginTop:5, fontSize:14, color:Colors.black}} numberOfLines={0}>
                        {repo.description}
                    </Text>

                    <View style = {{marginTop:5}}>{CommonComponents.renderSepLine()}</View>
                    <View style={{marginTop:5,flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: 0}}>

                        <View style={{flexDirection: "column",alignItems:"center",backgroundColor:Colors.lineGray,borderRadius:8}}>
                            <Icon.Button style={{width:150, justifyContent:"center"}}
                                         color={Colors.black} name="ios-star-outline"
                                         backgroundColor={Colors.green}
                                         onPress={this.star}>
                                {this.state.isStar? "Unstar": "Star"}
                            </Icon.Button>
                            <Text style={{height:20,margin:5, fontSize:13}}>
                                {"[ " + repo.stars_count +" stars ]"}
                            </Text>
                        </View>
                        <View style={{width:150,flexDirection: "column",alignItems:"center",backgroundColor:Colors.lineGray,borderRadius:8}}>
                            <Icon.Button style={{width:150, justifyContent:"center"}}
                                         color={Colors.black}
                                         name="happy-outline"
                                         backgroundColor={Colors.green}
                                         onPress={this.watch}>
                                {this.state.isWatch?"Unwatch": "Watch"}
                            </Icon.Button>
                            <Text style={{height:20, margin:5, fontSize:13}}>
                                {"[ " + repo.watches_count +" watches ]"}
                            </Text>
                        </View>
                    </View>


                    <View style={{marginTop:5,padding: 10,flexDirection:"column",backgroundColor:Colors.lineGray,borderRadius:8}}>
                        <View style={{flexDirection:"row"}}>

                            <View style={styles.user}>
                                <Icon
                                    name={"ios-time"}
                                    size={20}
                                    style={styles.arrow}
                                    color={Colors.blue}/>
                                <View style={styles.nameInfo}>
                                    <Text style={styles.name}>
                                        {new Date(repo.last_push_at).format("yyyy-MM-dd")}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flex: 1}}></View>
                            <View style={styles.user}>
                                <Icon
                                    name={"fork"}
                                    size={20}
                                    style={styles.arrow}
                                    color={Colors.blue}/>
                                <View style={styles.nameInfo}>
                                    <Text style={styles.name}>
                                        {repo.forks_count}
                                    </Text>
                                </View>
                            </View>

                        </View>

                        <View style={{flexDirection:"row"}}>

                            <View style={styles.user}>
                                <Icon
                                    name={repo.public?"ios-unlocked" : "ios-locked"}
                                    size={20}
                                    style={styles.arrow}
                                    color={Colors.blue}/>
                                <View style={styles.nameInfo}>
                                    <Text style={styles.name}>
                                        {repo.public?"Public":"Private"}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flex: 1}}></View>
                            <View style={styles.user}>
                                <Icon
                                    name={"ios-pricetag"}
                                    size={20}
                                    style={styles.arrow}
                                    color={Colors.blue}/>
                                <View style={styles.nameInfo}>
                                    <Text style={styles.name}>
                                        {repo.language}
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </View>


                    <View style={{flexDirection: 'column',
                                padding: 5,
                                paddingBottom: 0}}>
                        <SettingsCell
                            iconName={'ios-person'}
                            iconColor={Colors.blue}
                            settingName={"拥有者 " + repo.owner.username}
                            />
                        <SettingsCell
                            iconName={'document-text'}
                            iconColor={Colors.blue}
                            settingName={"readme"}
                            onPress = {() => {
                                let obj = {
                                    html : 'https://git.oschina.net//' + repo.path_with_namespace + '/blob/master/README.md',
                                    title:repo.name + " READNE.md"
                                };
                               this.props.navigator.push({id: 'web', obj: obj});
                            }}
                        />
                        <SettingsCell
                            iconName={'code'}
                            iconColor={Colors.blue}
                            settingName={"代码"}
                        />
                        <SettingsCell
                            iconName={'ios-at'}
                            iconColor={Colors.blue}
                            settingName={"问题"}
                        />
                        <SettingsCell
                            iconName={'quote'}
                            iconColor={Colors.blue}
                            settingName={"提交"}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
});

var styles = StyleSheet.create({
    user: {
        padding: 8,
        paddingLeft: 10,
        paddingRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width:150,
    },
    nameInfo: {
        flexDirection: 'column',
        marginLeft: 0,
        justifyContent: 'center',
        flex: 1,
    },
    name: {
        color: Colors.black,
        fontSize: 14,
    },
    arrow: {
        width: 20,
        height: 20,
        marginRight: 10,
    }
});
module.exports = RepoDetailComponent;