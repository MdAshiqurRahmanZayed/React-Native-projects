import React from 'react';
import { View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PickImage = ({setImage,image}) => {
    // console.log(image);
    const handleImagePick = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64:true
            });
            if (!result.canceled) {
                setImage(result.assets[0].uri);
                // console.log(result)
            }
        }
        catch (E) {
            console.log(E);
        }
    }
    let showImage = null
    if (image !== "") {
        showImage = <Image source={{ uri: image }} style={{ width: "100%", height: 200, marginBottom: 10 }} />
    }
    return (
        <View>
            {showImage}
            <Button title="Pick an Image" onPress={handleImagePick} />
        </View>
    )
}

export default PickImage;