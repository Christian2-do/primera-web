import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const getCurrentPosition = async () => {
  const { coords } = await Geolocation.getCurrentPosition();
  return coords;
};

export const takePhoto = async () => {
  const photo = await Camera.getPhoto({
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera,
    quality: 90,
  });
  return photo.dataUrl;
};