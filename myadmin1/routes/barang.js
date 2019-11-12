var express = require('express');
var router = express.Router();

/* GET Barang page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM barang',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('barang/list',{title:"Barang",data:rows});
		});
     });
});
router.post('/add', function(req, res, next) {
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

        v_code = req.sanitize( 'code' ).escape();
		v_name = req.sanitize( 'name' ).escape(); 
		v_merk = req.sanitize( 'merk' ).escape();
		v_unit = req.sanitize( 'unit' ).escape();
		v_ammount = req.sanitize( 'ammount' ).escape();
		v_price = req.sanitize( 'price' ).escape();

		var barang = {
            code: v_code,
			name: v_name,
			merk: v_merk,
			unit: v_unit,
			ammount: v_ammount,
			price : v_price
		}

		var insert_sql = 'INSERT INTO barang SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/add-barang', 
					{ 
                        code: req.param('code'),
						name: req.param('name'), 
						merk: req.param('merk'),
						unit: req.param('unit'),
						ammount : req.param('ammount'),
						price: req.param('price'),
					});
				}else{
					req.flash('msg_info', 'Create barang success'); 
					res.redirect('/barang');
				}		
			});
		});
	}else{
		console.log(errors);
		errors_detail = "Sorry there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('barang/add-barang', 
		{ 
			name: req.param('name'), 
			merk: req.param('merk')
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'barang/add-barang', 
	{ 
        title: 'Add New Barang',
        code: '',
		name: '',
		merk: '',
		unit:'',
		ammount:'',
		price:''
	});
});
router.get('/edit/(:id)', function(req,res,_next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM barang where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/barang'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Barang can't be find!"); 
					res.redirect('/barang');
				}
				else
				{	
					console.log(rows);
					res.render('barang/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:id)', function(req,res,next){
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
        v_code = req.sanitize( 'code' ).escape()
		v_name = req.sanitize( 'name' ).escape() 
		v_merk = req.sanitize( 'merk' ).escape()
		v_unit = req.sanitize( 'unit' ).escape()
		v_ammount = req.sanitize( 'ammount' ).escape()
		v_price = req.sanitize( 'price' ).escape();

		var barang = {
			code: v_code,
			name: v_name,
			merk: v_merk,
			unit: v_unit,
			ammount: v_ammount,
			price : v_price
		}

		var update_sql = 'update barang SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/edit', 
					{ 
						code: req.param('code'),
						name: req.param('name'), 
						merk: req.param('merk'),
						unit: req.param('unit'),
						ammount: req.param('ammount'),
						price: req.param('price')
					});
				}else{
					req.flash('msg_info', 'Update barang success'); 
					res.redirect('/barang/edit/'+req.params.id);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sorry there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('barang/add-barang', 
		{ 
			name: req.param('name'), 
			merk: req.param('merk')
		});
	}
});
router.delete('/delete/(:id)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var barang = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from barang where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/barang');
				}
				else{
					req.flash('msg_info', 'Delete Barang Success'); 
					res.redirect('/barang');
				}
			});
		});
	});
});
module.exports = router;