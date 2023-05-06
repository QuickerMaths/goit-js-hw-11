import axios from 'axios';

export const fetchPhotos = async (param, page) => {
  const response = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '36122798-126f6f1a20852f6b44c2688a3',
      q: param,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    },
  });
  return response.data;
};
