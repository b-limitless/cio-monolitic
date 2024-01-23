import request from 'supertest';
import { app } from '../../../app';

const cartData = {
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

it('create a cart with the data', async () => {
  await request(app).post('/api/cart').send({}).expect(400);
});

it('successfully creates cart', async () => {
  const response = await request(app)
    .post('/api/cart')
    .send(cartData)
    .expect(200);

  // Manually tested
  // const {sessionId} = JSON.parse(response.text);

  // Add again the product in that case session id will be same
  // const response1 = await request(app).post('/api/cart').send(cartData).expect(200);

  // const {sessionId: sessionIdSecond} = JSON.parse(response1.text);

  // expect(sessionIdSecond).toEqual(sessionId);
});

it('signin the cusomer and create cart and check the customer Id is is same', async () => {
  const response = await request(app)
    .post('/api/cart')
    .set('Cookie', global.signinCustomer())
    .send(cartData)
    .expect(200);
  const { customerId, sessionId } = JSON.parse(response.text);

  expect(customerId).toBeDefined();
  expect(sessionId).toBeNull();
});

it('if user is not signined in then and then only there should be sessionId', async () => {
  const response = await request(app)
    .post('/api/cart')
    .send(cartData)
    .expect(200);
  const { customerId, sessionId } = JSON.parse(response.text);

  expect(customerId).toBeNull();
  expect(sessionId).toBeDefined();
});

it('update the the cart item', async() => {
    // Create the cart first
    const qtyUpdate = 10;
    const subTotalUpdate = 100;

    const customer = global.signinCustomer();

    const response = await request(app)
    .post('/api/cart')
    .set('Cookie', customer)
    .send(cartData)
    .expect(200);

    const { customerId, sessionId, id } = JSON.parse(response.text);

    const newCart = JSON.parse(JSON.stringify(cartData));
    newCart.qty = 10;
    newCart.subTotal = 100;

    const updateCart = await request(app)
    .patch(`/api/cart/${id}`)
    .set('Cookie', customer)
    .send(newCart)
    .expect(200);

    // console.log('updateCart.text', updateCart.text);
    const { qty, subTotal } = JSON.parse(updateCart.text);

    expect(qty).toEqual(qtyUpdate);
    expect(subTotal).toEqual(subTotalUpdate);
});

it.todo(`Create validation for data structure which is passed to cart, such as febric, model
They are complex data structure need more time 
`);
