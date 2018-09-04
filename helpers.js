import React from 'react';
import TouchableImage from './components/TouchableImage';
import {View} from 'react-native';

export const renderRow = (images) => {
    const Images = () => images.map((item, index) =>
        <TouchableImage
            key={index}
            item={item}
            index={index}
        />
    );

    return (
        <View style={{flexDirection: 'row'}}>
            <Images/>
        </View>
    );
};
