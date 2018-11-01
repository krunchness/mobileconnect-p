$(document).ready( function () {
    var table = $('#filesTable').dataTable({
    	'pagingType' : 'simple_numbers'
    });

    function waitForElement(elementPath, callBack) {
      window.setTimeout(function() {
        if($(elementPath).length) {
          callBack(elementPath, $(elementPath));
        } 
        else {
          waitForElement(elementPath, callBack);
        }
      },500)
    }

    waitForElement(".dataTables_paginate",function(){

    	$('.dataTables_paginate a').on('click', function(e){
    		e.preventDefault();
    	});
    });


        $('.end_date, .start_date').change(function(){
            console.log(table);
            var oTable = $('#filesTable').dataTable( {"bRetrieve": true} );
            oTable.fnClearTable();
            var datefilter_json_path = $('.inquiries-datas').attr('datefilter-json-path');
            var start_date_val = $('.start_date').val();
            var end_date_val = $('.end_date').val()
            var datas = {
                start_date : start_date_val,
                end_date : end_date_val
            };

            $.get(datefilter_json_path, datas, function(result){
                // console.log(result[0].anniv_date);

                var info_ids = [];
                $.each(result, function(index , value){
                    oTable.fnAddData([
                        value.created_at.date,
                        value.first_name,
                        value.last_name,
                        value.gender,
                        value.birth_date,
                        value.anniv_date,
                        value.mobile_no,
                        value.cpconnect_question,
                        value.buttons
                    ]);

                    info_ids.push(value.inquiry_id);

                });
                
                waitForElement("#filesTable tbody tr",function(){

                    $('.delete-inquiry-btn').on('click', function(){
                        var inquiryname = $(this).attr('data-name');
                        var inquiry_id = $(this).attr('delete-inquiry-id'); 
                        $('.inquiry-name').text(inquiryname);
                        $('.confirm-delete-btn').attr('data-id', inquiry_id);
                    });

                    $('.inquiries-datas').attr('download-only-ids', info_ids);
                });
                
            } );
        });

        $('.export-csv-btn').on('click', function(event){

            event.preventDefault();

            var export_path = $(this).attr('href');
            var inquiry_ids = $('.inquiries-datas').attr('download-only-ids');

            if (inquiry_ids != '') {

                window.open(export_path + '?inquiries_ids='+ inquiry_ids);

            }else{

                window.open(export_path);

            }
        });

    // $('.export-csv-btn').on('click', function(){


    //   var export_data = JSON.parse($(this).attr('export-data'));
    //   console.log(export_data);
    //   var download_path;
    //   $.ajax({
    //      type:'GET',
    //      url: export_data.export_url,
    //      success:function(data){
    //      }
    //   });
      
    // });

    $('.delete-inquiry-btn').on('click', function(){
        var inquiryname = $(this).attr('data-name');
        var inquiry_id = $(this).attr('delete-inquiry-id'); 
        $('.inquiry-name').text(inquiryname);
        $('.confirm-delete-btn').attr('data-id', inquiry_id);
    });

    var inst = $('[data-remodal-id=modal]').remodal();

    $('.add-item-btn').on('click',function(){
        inst.open();
    });

    $('.edit-user-btn').on('click', function(){

        var user_data = JSON.parse($(this).attr('user-data'));
        var update_user_path = $(this).attr('update-path');

        $('.edit_username_input').val(user_data.username);
        $('.edit_name_input').val(user_data.name);
        $('.edit_email_input').val(user_data.email);
        $('.edit_user_form').attr('action', update_user_path);
        $('[data-remodal-id=edit_user]').remodal().open();

    });


} );