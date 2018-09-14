import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {CameraRoll, FlatList, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import {withRedux} from '../redux-factory';
import {numPictures, thumbnailImageSize} from '../constants/variables';
import {darkFontStyles} from '../constants/font-styles';
import TouchableImage from '../components/TouchableImage';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false
        };
        this.currSelected = {};
    }

    componentDidMount() {
        CameraRoll.getPhotos({
            first: numPictures,
            assetType: 'All',
        }).then((r) => this.props.actions.setCameraRollRows(r));
    }

    setSelected = (item, isSelected) => {
        const {image: {filename}} = item;

        if (isSelected) {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: item
            };
        } else {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: null
            };
        }
    };

    toggleSelected = (item) => {
        const {image: {filename}} = item;

        if (!this.currSelected[`${filename}`]) {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: item
            };
        } else {
            this.currSelected = {
                ...this.currSelected,
                [`${filename}`]: null
            };
        }
    };

    toggleModal = () => {
        this.setState({modalVisible: !this.state.modalVisible});
    };

    renderRow = (images) => {
        let isSelected = true;
        images.forEach((i) => !this.currSelected[i.image.filename] ? isSelected = false : null);

        return (
            <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                    {!isSelected ?
                        <Touchable
                            onPress={() => {
                                images.forEach((i) => this.setSelected(i, true));
                                this.forceUpdate();
                            }}
                        >
                            <Entypo
                                size={20}
                                color={'green'}
                                name={'circle-with-plus'}
                            />
                        </Touchable>
                        :
                        <Touchable
                            onPress={() => {
                                images.forEach((i) => this.setSelected(i, false));
                                this.forceUpdate();
                            }}
                        >
                            <Entypo
                                size={20}
                                color={'red'}
                                name={'circle-with-minus'}
                            />
                        </Touchable>
                    }
                </View>
                {
                    images.map((item) =>
                        <TouchableImage
                            key={`${item.image.filename}`}
                            item={item}
                            selected={this.currSelected[item.image.filename]}
                            toggleSelected={this.toggleSelected}
                        />
                    )
                }
            </View>
        );
    };

    render() {
        const {actions, cameraRollRows} = this.props;

        return (
            <View style={styles.wrapper}>
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.modalVisible}
                >
                    <SafeAreaView>
                        <View style={styles.header}>
                            <Touchable
                                onPress={() => {
                                    this.toggleModal();
                                    this.currSelected = [];
                                }}
                            >
                                <EvilIcons
                                    name={'close'}
                                    size={30}
                                />
                            </Touchable>
                            <Text
                                onPress={this.toggleModal}
                                style={[
                                    darkFontStyles.regular,
                                    {color: 'blue'}
                                ]}
                            >
                                {'Done'}
                            </Text>
                        </View>
                        <FlatList
                            data={cameraRollRows}
                            extraData={this.currSelected}
                            keyExtractor={(item) => `${item[0].timestamp}`}
                            renderItem={({item}) => this.renderRow(item)}
                        />
                    </SafeAreaView>
                </Modal>

                <View style={styles.homeWrapper}>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <Touchable
                            onPress={this.toggleModal}
                        >
                            <Entypo
                                size={60}
                                name={'circle-with-plus'}
                            />
                        </Touchable>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <Touchable
                            onPress={() => {
                                actions.setSelectedImages(this.currSelected);
                                this.currSelected = [];
                            }}
                        >
                            <View style={styles.buttonView}>
                                <Text
                                    style={[
                                        darkFontStyles.regular,
                                        {color: 'blue'}
                                    ]}
                                >
                                    {'UPLOAD'}
                                </Text>
                            </View>
                        </Touchable>
                    </View>
                    <ScrollView style={styles.scrollView}>
                        {
                            Object.keys(this.currSelected).map((key) =>
                                this.currSelected[key] ?
                                    <View
                                        key={key}
                                        style={styles.previewRow}
                                    >
                                        <Image
                                            style={styles.imageThumbnail}
                                            source={{uri: this.currSelected[key].image.uri}}
                                        />
                                        <Text
                                            style={darkFontStyles.light}>{this.currSelected[key].image.filename}</Text>
                                    </View>
                                    :
                                    null
                            )
                        }
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignContent: 'center'
    },
    wrapper: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    homeWrapper: {
        marginTop: '15%',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    buttonView: {
        marginTop: '20%',
        width: '100%',
        padding: 20,
        borderColor: 'blue',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#ebebeb',
        justifyContent: 'center',
        alignContent: 'center'
    },
    imageThumbnail: {
        width: thumbnailImageSize,
        height: thumbnailImageSize
    },
    previewRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly'
    },
    scrollView: {
        marginTop: '10%'
    }
});

export default withRedux(Home);
