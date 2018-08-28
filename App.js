import React from 'react';
import {StyleSheet, Text, Touchable, View, CameraRoll, Button, ScrollView, Image} from 'react-native';

export default class App extends React.Component {
    state = {
        photos: []
    };

    componentDidMount() {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
        })
            .then(r => {
                this.setState({ photos: r.edges });
            })
            .catch((err) => {
                //Error Loading Images
            });
    }

    render() {
        return (
            <View>
                <ScrollView style={{paddingTop: 35}}>
                    {this.state.photos.map((p, i) => {
                        return (
                            <Image
                                key={i}
                                style={{
                                    width: 400,
                                    height: 100,
                                }}
                                source={{ uri: p.node.image.uri }}
                            />
                        );
                    })}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
