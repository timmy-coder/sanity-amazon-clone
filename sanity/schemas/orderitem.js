export default {
    title: 'Order Item',
    name: 'orderItem',
    type: 'object',
    fields: [
      {
        title: 'Name',
        name: 'name',
        type: 'string',
      },
      {
        title: 'quantity',
        name: 'quantity',
        type: 'number',
      },
      {
        title: 'image',
        name: 'image',
        type: 'string',
      },
      {
        title: 'price',
        name: 'price',
        type: 'number',
      },
      {
        title: 'slug',
        name: 'slug',
        type: 'string',
      },
      {
        name: 'countInStock',
        title: 'CountInStock',
        type: 'number',
    },
    ],
  };