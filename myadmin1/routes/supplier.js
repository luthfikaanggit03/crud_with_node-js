var express = require('express');
var router = express.Router();

/* GET supplier page. */

router.get('/', function(req, res, _next) {
	req.getConnection(function(_err,connection){
		var query = connection.query('SELECT * FROM supplier',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('supplier/list',{title:"supplier",data:rows});
		});
     });
});
router.post('/add', function(req, res, _next) {
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_code = req.sanitize( 'code' ).escape().
		v_name = req.sanitize( 'name' ).escape() 
		v_email = req.sanitize( 'email' ).escape()
		v_address = req.sanitize( 'address' ).escape()
		v_phone = req.sanitize( 'phone' ).escape();

		var supplier = {
			code:  v_code,
			name: v_name,
			address: v_address,
			email: v_email,
			phone : v_phone
		}

		var insert_sql = 'INSERT INTO supplier SET ?';
		req.getConnection(function(_err,connection){
			var query = connection.query(insert_sql, supplier, function(err, _result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('supplier/add-supplier', 
					{ 
						code: req.param('code'),
						name: req.param('name'), 
						address: req.param('address'),
						email: req.param('email'),
						phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Create supplier success'); 
					res.redirect('/supplier');
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
		res.render('supplier/add-supplier', 
		{ 
			name: req.param('name'), 
			address: req.param('address')
		});
	}

});

router.get('/add', function(_req, res, _next) {
	res.render(	'supplier/add-supplier', 
	{ 
		title: 'Add New Supplier',
		code: '',
		name: '',
		email: '',
		phone:'',
		address:''
	});
});
router.get('/edit/(:id)', function(req,res,_next){
	req.getConnection(function(_err,connection){
		var query = connection.query('SELECT * FROM supplier where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/supplier'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Supplier can't be find!"); 
					res.redirect('/supplier');
				}
				else
				{	
					console.log(rows);
					res.render('supplier/edit',{title:"Edit",data:rows[0]});

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
		v_email = req.sanitize( 'email' ).escape()
		v_address = req.sanitize( 'address' ).escape()
		v_phone = req.sanitize( 'phone' ).escape()

		var supplier = {
			code: v_code,
			name: v_name,
			address: v_address,
			email: v_email,
			phone : v_phone
		}

		var update_sql = 'update supplier SET ? where id = '+req.params.id;
		req.getConnection(function(_err,connection){
			var query = connection.query(update_sql, supplier, function(err, _result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('supplier/edit', 
					{ 
						code: req.param('code'),
						name: req.param('name'), 
						address: req.param('address'),
						email: req.param('email'),
						phone: req.param('phone'),
					});
				}else{
					req.flash('msg_info', 'Update supplier success'); 
					res.redirect('/supplier/edit/'+req.params.id);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('supplier/add-supplier', 
		{ 
			name: req.param('name'), 
			address: req.param('address')
		});
	}
});
router.delete('/delete/(:id)', function(req, res, _next) {
	req.getConnection(function(_err,_connection){
		var supplier = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from supplier where ?';
		req.getConnection(function(_err,connection){
			var query = connection.query(delete_sql, supplier, function(err, _result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/supplier');
				}
				else{
					req.flash('msg_info', 'Delete Supplier Success'); 
					res.redirect('/supplier');
				}
			});
		});
	});
});
module.exports = router;