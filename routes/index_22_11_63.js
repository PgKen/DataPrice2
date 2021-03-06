var express = require('express');
var router = express.Router();

var mysql = require('mysql')

var db_config = {
  host: 'localhost',
  user: 'root',
  password: 'comp@113',
  //password: 'ken27@pg',
  database: 'srimuangweb'
};

var conn;

function handleDisconnect() {
  conn = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  conn.connect(function (err) { // The server is either down
    if (err) { // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  conn.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else { // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();

function dateChk() {
  let dateChkNow = ''
  var sqlDateChk = "SELECT date_check FROM tb_priceproduct ORDER BY id_pricepro DESC LIMIT 0,1"
  conn.query(sqlDateChk, (err, result) => {
    return result
  })
  //
}


function convertDateInDBFormate(timestamp) {
  //If input date is not valid date then assign a default value
  if ((new Date(timestamp)).getTime() > 0) {
    var date = new Date(timestamp);
    return (date.getFullYear() + '-' + (date.getMonth() + 01) + '-' + date.getDate());
  } else {
    return '1900-01-01';
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/rand5', (req, res) => {
  //id_prod, name_pro, price_pro, date_check
  var sql = "SELECT id_prod, name_pro, price_pro, date_check FROM tb_priceproduct"
  sql += " inner join tb_proselect on tb_priceproduct.id_pricepro = tb_proselect.idprice"
  sql += " inner join tb_product on tb_proselect.id_prod = tb_product.id_product"
  sql += " inner join tb_typeproduct on tb_product.typepro = tb_typeproduct.id_typepro"
  sql += " WHERE id_mtype = 1"
  sql += " ORDER BY date_check DESC,rand() LIMIT 0, 5"
  conn.query(sql, (err, result) => {
    res.send(result)
  })
})

router.get('/allpriceB1', (req, res) => {
  var sql = "SELECT id_prod,name_pro,price_pro,date_check FROM tb_priceproduct"
  sql += " inner join tb_proselect on tb_priceproduct.id_pricepro = tb_proselect.idprice"
  sql += " inner join tb_product on tb_proselect.id_prod = tb_product.id_product"
  sql += " inner join tb_typeproduct on tb_product.typepro = tb_typeproduct.id_typepro"
  sql += " WHERE id_mtype = 1"
  sql += " ORDER BY date_check"
  conn.query(sql, (err, result) => {
    res.send(sql)
    //res.send(result)
  })
})

router.get('/allpriceB8', (req, res) => {
  var sql = "SELECT id_prod,name_pro,price_pro,date_check FROM tb_priceproduct"
  sql += " inner join tb_proselect on tb_priceproduct.id_pricepro = tb_proselect.idprice"
  sql += " inner join tb_product on tb_proselect.id_prod = tb_product.id_product"
  sql += " inner join tb_typeproduct on tb_product.typepro = tb_typeproduct.id_typepro"
  sql += " WHERE id_mtype = 8"
  sql += " ORDER BY date_check LIMIT 0,5"
  conn.query(sql, (err, result) => {
    res.send(result)
  })
})

router.get('/allpriceB10', (req, res) => {
  var sql = "SELECT id_prod,name_pro,price_pro,date_check FROM tb_priceproduct"
  sql += " inner join tb_proselect on tb_priceproduct.id_pricepro = tb_proselect.idprice"
  sql += " inner join tb_product on tb_proselect.id_prod = tb_product.id_product"
  sql += " inner join tb_typeproduct on tb_product.typepro = tb_typeproduct.id_typepro"
  sql += " WHERE id_mtype = 10"
  sql += " ORDER BY date_check"
  conn.query(sql, (err, result) => {
    res.send(result)
  })
})

router.get('/allpriceB14', (req, res) => {
  var sql = "SELECT id_prod,name_pro,price_pro,date_check FROM tb_priceproduct"
  sql += " inner join tb_proselect on tb_priceproduct.id_pricepro = tb_proselect.idprice"
  sql += " inner join tb_product on tb_proselect.id_prod = tb_product.id_product"
  sql += " inner join tb_typeproduct on tb_product.typepro = tb_typeproduct.id_typepro"
  sql += " WHERE id_mtype = 14"
  sql += " ORDER BY date_check"
  conn.query(sql, (err, result) => {
    res.send(result)
  })
})

//SELECT * FROM tb_priceproduct ORDER BY id_pricepro DESC LIMIT 0, 1
// Start
function dateNowS() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return nowtoday = yyyy + '-' + mm + '-' + dd;
}
//??????????????? ???????????????????????????
router.get('/checkB1', (req, res) => {
  var sqlDateChk = "SELECT date_check FROM tb_priceproduct ORDER BY id_pricepro DESC LIMIT 0,1"
  conn.query(sqlDateChk, (err, result1) => {

    var fullStrDate = result1[0].date_check
    var dateFormat = convertDateInDBFormate(fullStrDate)

    var sql = "SELECT "
    sql += "tb_proselect.id_prod,tb_product.name_pro,tb_proselect.price_pro,"
    sql += "tb_typeproduct.id_typepro,tb_typeproduct.id_mtype," /*tb_maintype.name_mtype,"*/
    sql += "tb_priceproduct.date_check,tb_unit.unitname"
    sql += " FROM tb_priceproduct"
    sql += " INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice"
    sql += " INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product"
    sql += " INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro"
    sql += " INNER JOIN tb_maintype ON tb_typeproduct.id_mtype = tb_maintype.id_maintype"
    sql += " INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit"
    sql += " WHERE id_mtype = 1 and date_check = '" + dateFormat + "'"
    sql += " GROUP BY id_prod"
    sql += " ORDER BY date_check DESC"
    conn.query(sql, (err, result) => {
      //res.send(sql)
       res.send(result)
    })
  })
})
// ??????????????? ???????????????????????????
router.get('/checkB8', (req, res) => {
  var sqlDateChk = "SELECT date_check FROM tb_priceproduct ORDER BY id_pricepro DESC LIMIT 0,1"
  conn.query(sqlDateChk, (err, result1) => {

    var fullStrDate = result1[0].date_check
    var dateFormat = convertDateInDBFormate(fullStrDate)

    var sql = "SELECT "
    sql += "tb_proselect.id_prod,tb_product.name_pro,tb_proselect.price_pro,"
    sql += "tb_typeproduct.id_typepro,tb_typeproduct.id_mtype," /*tb_maintype.name_mtype,"*/
    sql += "tb_priceproduct.date_check,tb_unit.unitname"
    sql += " FROM tb_priceproduct"
    sql += " INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice"
    sql += " INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product"
    sql += " INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro"
    sql += " INNER JOIN tb_maintype ON tb_typeproduct.id_mtype = tb_maintype.id_maintype"
    sql += " INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit"
    sql += " WHERE id_mtype = 8 and date_check = '" + dateFormat + "'"
    sql += " GROUP BY id_prod"
    sql += " ORDER BY date_check DESC"
    conn.query(sql, (err, result) => {
      res.send(result)
    })
  })
})
//??????????????? ????????????????????????????????????
router.get('/checkB9', (req, res) => {
  var sqlDateChk = "SELECT date_check FROM tb_priceproduct ORDER BY id_pricepro DESC LIMIT 0,1"
  conn.query(sqlDateChk, (err, result1) => {

    var fullStrDate = result1[0].date_check
    var dateFormat = convertDateInDBFormate(fullStrDate)

    var sql = "SELECT "
    sql += "tb_proselect.id_prod,tb_product.name_pro,tb_proselect.price_pro,"
    sql += "tb_typeproduct.id_typepro,tb_typeproduct.id_mtype," /*tb_maintype.name_mtype,"*/
    sql += "tb_priceproduct.date_check,tb_unit.unitname"
    sql += " FROM tb_priceproduct"
    sql += " INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice"
    sql += " INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product"
    sql += " INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro"
    sql += " INNER JOIN tb_maintype ON tb_typeproduct.id_mtype = tb_maintype.id_maintype"
    sql += " INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit"
    sql += " WHERE id_mtype = 9 and date_check = '" + dateFormat + "'"
    sql += " GROUP BY id_prod"
    sql += " ORDER BY date_check DESC"
    conn.query(sql, (err, result) => {
      res.send(result)
    })
  })
})
// ??????????????? ?????????????????????????????????
router.get('/checkB10', (req, res) => {
  var sqlDateChk = "SELECT date_check FROM tb_priceproduct ORDER BY id_pricepro DESC LIMIT 0,1"
  conn.query(sqlDateChk, (err, result1) => {

    var fullStrDate = result1[0].date_check
    var dateFormat = convertDateInDBFormate(fullStrDate)

    var sql = "SELECT "
    sql += "tb_proselect.id_prod,tb_product.name_pro,tb_proselect.price_pro,"
    sql += "tb_typeproduct.id_typepro,tb_typeproduct.id_mtype," /*tb_maintype.name_mtype,"*/
    sql += "tb_priceproduct.date_check,tb_unit.unitname"
    sql += " FROM tb_priceproduct"
    sql += " INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice"
    sql += " INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product"
    sql += " INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro"
    sql += " INNER JOIN tb_maintype ON tb_typeproduct.id_mtype = tb_maintype.id_maintype"
    sql += " INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit"
    sql += " WHERE id_mtype = 10 and date_check = '" + dateFormat + "'"
    sql += " GROUP BY id_prod"
    sql += " ORDER BY date_check DESC"
    conn.query(sql, (err, result) => {
      res.send(result)
    })
  })
})
// ??????????????? ??????????????????
router.get('/checkB14', (req, res) => {
  var sqlDateChk = "SELECT date_check FROM tb_priceproduct ORDER BY id_pricepro DESC LIMIT 0,1"
  conn.query(sqlDateChk, (err, result1) => {

    var fullStrDate = result1[0].date_check
    var dateFormat = convertDateInDBFormate(fullStrDate)

    var sql = "SELECT "
    sql += "tb_proselect.id_prod,tb_product.name_pro,tb_proselect.price_pro,"
    sql += "tb_typeproduct.id_typepro,tb_typeproduct.id_mtype," /*tb_maintype.name_mtype,"*/
    sql += "tb_priceproduct.date_check,tb_unit.unitname"
    sql += " FROM tb_priceproduct"
    sql += " INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice"
    sql += " INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product"
    sql += " INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro"
    sql += " INNER JOIN tb_maintype ON tb_typeproduct.id_mtype = tb_maintype.id_maintype"
    sql += " INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit"
    sql += " WHERE id_mtype = 14 and date_check = '" + dateFormat + "'"
    sql += " GROUP BY id_prod"
    sql += " ORDER BY date_check DESC"
    conn.query(sql, (err, result) => {
      res.send(result)
    })
  })
})
//??????????????? ?????????????????????????????????
router.get('/checkB11', (req, res) => {
  var sqlDateChk = "SELECT date_check FROM tb_priceproduct ORDER BY id_pricepro DESC LIMIT 0,1"
  conn.query(sqlDateChk, (err, result1) => {

    var fullStrDate = result1[0].date_check
    var dateFormat = convertDateInDBFormate(fullStrDate)

    var sql = "SELECT "
    sql += "tb_proselect.id_prod,tb_product.name_pro,tb_proselect.price_pro,"
    sql += "tb_typeproduct.id_typepro,tb_typeproduct.id_mtype," /*tb_maintype.name_mtype,"*/
    sql += "tb_priceproduct.date_check,tb_unit.unitname"
    sql += " FROM tb_priceproduct"
    sql += " INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice"
    sql += " INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product"
    sql += " INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro"
    sql += " INNER JOIN tb_maintype ON tb_typeproduct.id_mtype = tb_maintype.id_maintype"
    sql += " INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit"
    sql += " WHERE id_mtype = 11 and date_check = '" + dateFormat + "'"
    sql += " GROUP BY id_prod"
    sql += " ORDER BY date_check DESC"
    conn.query(sql, (err, result) => {
      res.send(result)
    })
  })
})

// ??????????????? ??????????????? ?????????
router.get('/checkB12', (req, res) => {
  var sqlDateChk = "SELECT date_check FROM tb_priceproduct ORDER BY id_pricepro DESC LIMIT 0,1"
  conn.query(sqlDateChk, (err, result1) => {

    var fullStrDate = result1[0].date_check
    var dateFormat = convertDateInDBFormate(fullStrDate)

    var sql = "SELECT "
    sql += "tb_proselect.id_prod,tb_product.name_pro,tb_proselect.price_pro,"
    sql += "tb_typeproduct.id_typepro,tb_typeproduct.id_mtype," /*tb_maintype.name_mtype,"*/
    sql += "tb_priceproduct.date_check,tb_unit.unitname"
    sql += " FROM tb_priceproduct"
    sql += " INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice"
    sql += " INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product"
    sql += " INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro"
    sql += " INNER JOIN tb_maintype ON tb_typeproduct.id_mtype = tb_maintype.id_maintype"
    sql += " INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit"
    sql += " WHERE id_mtype = 12 and date_check = '" + dateFormat + "'"
    sql += " GROUP BY id_prod"
    sql += " ORDER BY date_check DESC"
    conn.query(sql, (err, result) => {
      res.send(result)
    })
  })
})

// ??????????????? ?????????
router.get('/checkB15', (req, res) => {
  var sqlDateChk = "SELECT date_check FROM tb_priceproduct ORDER BY id_pricepro DESC LIMIT 0,1"
  conn.query(sqlDateChk, (err, result1) => {

    var fullStrDate = result1[0].date_check
    var dateFormat = convertDateInDBFormate(fullStrDate)

    var sql = "SELECT "
    sql += "tb_proselect.id_prod,tb_product.name_pro,tb_proselect.price_pro,"
    sql += "tb_typeproduct.id_typepro,tb_typeproduct.id_mtype," /*tb_maintype.name_mtype,"*/
    sql += "tb_priceproduct.date_check,tb_unit.unitname"
    sql += " FROM tb_priceproduct"
    sql += " INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice"
    sql += " INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product"
    sql += " INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro"
    sql += " INNER JOIN tb_maintype ON tb_typeproduct.id_mtype = tb_maintype.id_maintype"
    sql += " INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit"
    sql += " WHERE id_mtype = 15 and date_check = '" + dateFormat + "'"
    sql += " GROUP BY id_prod"
    sql += " ORDER BY date_check DESC"
    conn.query(sql, (err, result) => {
      res.send(result)
    })
  })
})
// End 
// Search
router.get('/search/:name', (req, res) => {
  let name = req.params.name
  //res.send('name = ' + name)
  //
  var sqlDateChk = "SELECT date_check FROM tb_priceproduct ORDER BY id_pricepro DESC LIMIT 0,1"
  conn.query(sqlDateChk, (err, result1) => {

    var fullStrDate = result1[0].date_check
    var dateFormat = convertDateInDBFormate(fullStrDate)

    var sql = "SELECT "
    sql += "tb_proselect.id_prod,tb_product.name_pro,tb_proselect.price_pro,"
    sql += "tb_typeproduct.id_typepro,tb_typeproduct.id_mtype," /*tb_maintype.name_mtype,"*/
    sql += "tb_priceproduct.date_check,tb_unit.unitname"
    sql += " FROM tb_priceproduct"
    sql += " INNER JOIN tb_proselect ON tb_priceproduct.id_pricepro = tb_proselect.idprice"
    sql += " INNER JOIN tb_product ON tb_proselect.id_prod = tb_product.id_product"
    sql += " INNER JOIN tb_typeproduct ON tb_product.typepro = tb_typeproduct.id_typepro"
    sql += " INNER JOIN tb_maintype ON tb_typeproduct.id_mtype = tb_maintype.id_maintype"
    sql += " INNER JOIN tb_unit ON tb_proselect.unit = tb_unit.id_unit"
    sql += " WHERE name_pro LIKE '%" + name + "%'"
    sql += " and date_check = '" + dateFormat + "'"
    sql += " GROUP BY id_prod"
    sql += " ORDER BY date_check DESC"
    conn.query(sql, (err, result) => {
      res.send(result)
      //res.send(sql)
    })
  })
  //

})
// End search

module.exports = router;