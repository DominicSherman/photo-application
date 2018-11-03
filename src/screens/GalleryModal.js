import React, {Component} from 'react';
import Gallery from 'react-native-image-gallery';
import Touchable from 'react-native-platform-touchable';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';

import {darkGray, lightGray} from '../constants/style-variables';
import {dismissModal} from '../services/navigation-service';
import {lightFontStyles} from '../constants/font-styles';

const styles = StyleSheet.create({
    header: {
        alignContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    }
});

export default class GalleryModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currIndex: this.props.initialPage,
            total: this.props.pictures.length
        };
    }

    render() {
        const {actions, initialPage, pictures} = this.props;

        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.header}>
                    <Text style={lightFontStyles.regular}>{`${this.state.currIndex}/${this.state.total}`}</Text>
                    <Touchable
                        onPress={() => {
                            dismissModal(this.props.componentId);
                            actions.setSelectedImages([]);
                        }}
                    >
                        <EvilIcons
                            name={'close'}
                            size={30}
                        />
                    </Touchable>
                </View>
                <Gallery
                    images={pictures}
                    initialPage={initialPage}
                    onPageScroll={(data) => this.setState({currIndex: data.position + 1})}
                    pageMargin={5}
                    style={{
                        backgroundColor: lightGray,
                        flex: 1
                    }}
                />
            </SafeAreaView>
        );
    }
}
