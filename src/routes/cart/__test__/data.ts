import supertest from "supertest";
export const cartData = {
    originalImageUrl:
      'https://res.cloudinary.com/dun5p8e5d/image/upload/v1704620406/images/ABC/xulgkzie5hkkrvpttxel.png',
    thumbnailImageUrl:
      'https://res.cloudinary.com/dun5p8e5d/image/upload/v1704620416/thumbnails/ABC/jtxc8moiphu8vwqrzjms.png',
    model: {
      collar: {
        id: 12,
        model: '/models/collars/collar-1-1.glb?timestamp=1704620380222',
        price: 0,
        title: 'Default collar model',
        label: 'default',
        code: 'default',
      },
      cuff: {
        id: 12,
        model: '/models/cuffs/cuff-1-normal.glb?timestamp=1704620380222',
        price: 0,
        title: 'default cuff model',
        label: 'default',
        code: 'default',
      },
    },
    accent: {
      collar: {
        id: 12,
        febric: '/img/febric-5.jpg',
        type: 'default',
        meshName: [],
        updatedFrom: 'febrics',
        price: 10,
      },
      cuff: {
        id: 12,
        febric: '/img/febric-5.jpg',
        type: 'default',
        meshName: [],
        updatedFrom: 'febrics',
        price: 10,
      },
    },
    modelType: 'shirt',
    subTotal: 50,
    qty: 1,
    discount: 0,
    availability: '',
    id: 1,
    deliveryTime: '3 weeks',
    febric: {
      id: 1,
      model: '/img/febric-5.jpg',
      price: 30,
      title: 'XYZ',
      material: 'Cotton 80 %',
      tone: 'light',
      febricTypes: 'string',
      season: 'summer',
      label: 'default',
      code: 'default',
      originalImageUrl: '/img/febric-5.jpg',
    },
    status: 'open',
  };