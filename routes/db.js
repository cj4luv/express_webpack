// var express = require('express');
import express from 'express';
var router = express.Router();
var moment = require('moment');
var ORDER_LIST_DATA = require('../DummyData/OrderListData');
var ORDER_PRODUCT_DATA = require('../DummyData/OrderProductData');
var QNA_DATA = require('../DummyData/QnADATA');
var REVIEW_DATA = require('../DummyData/ReviewData');
var TABLE_LIST_DATA = require('../DummyData/TableListData');
var ESSENTIAL_INFO_DATA = require('../DummyData/EssentialInfoData');
var SELLER_INFO_DATA = require('../DummyData/SellerInfoData');
var KIND_OF_PRODUCT_DATA = require('../DummyData/KindOfProductData');

/* GET home page. */
router.get('/order/list', function(req, res, next) {
  var tmp = ORDER_LIST_DATA;
  for(var key in tmp) {
    tmp[key].date = moment().set('hour', key).format()
  }
  res.json(ORDER_LIST_DATA);
});

router.get('/order/product', (req, res, next) => {
  res.json(ORDER_PRODUCT_DATA);
});

router.get('/qna', (req, res, next) => {
  var tmp = QNA_DATA;
  for(var key in tmp) {
    tmp[key].date = moment().set('hour', key).format()
  }
  res.json(QNA_DATA);
});

router.get('/review', (req, res) => {
  var tmp = REVIEW_DATA;
  for(var key in tmp) {
    tmp[key].date = moment().set('hour', key).format()
  }
  res.json(REVIEW_DATA);
});

router.get('/table/list', (req, res) => {
  var tmp = TABLE_LIST_DATA;
  for(var key in tmp) {
    tmp[key].date = moment().set('hour', key).format()
  }
  res.json(TABLE_LIST_DATA);
});
router.get('/info/essential', (req, res) => {
  res.json(ESSENTIAL_INFO_DATA);
});
router.get('/info/seller', (req, res) => {
  res.json(SELLER_INFO_DATA);
});
router.get('/product/kind', (req, res) => {
  res.json(KIND_OF_PRODUCT_DATA);
});

module.exports = router;
