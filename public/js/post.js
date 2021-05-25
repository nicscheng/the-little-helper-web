


$(document).ready(function() {


    //$('#reply_form').css('display','none');
    //$('#edit_form').css('display','none');

    $('#reply').click(function () {

        $("#reply_form").css('display','flex');
        $("#edit").hide();
        
        $('#reply_submit').click(function () {
            $("#reply_form").css('display','none');
            $("#edit").show();
        
        });

    });

    $('#edit').click(function () {

        $("#edit_form").css('display','flex');
        $("#reply").hide();
            
        $('#edit_submit').click(function () {
                $("#edit_form").css('display','none');
                $("#reply").show();
        });
    
    });


    $('#button2').click(function () {
        $(".bg_modal").css('display','flex');

        $('.close').click(function () {
            $(".bg_modal").css('display','none');
        });
    });

    $('#button3').click(function () {
        $(".bg_modal2").css('display','flex');

        $('.close2').click(function () {
            $(".bg_modal2").css('display','none');
        });
    });

    $('#button4').click(function () {
        $(".bg_modal3").css('display','flex');

        $('.close3').click(function () {
            $(".bg_modal3").css('display','none');
        });
    });
    
    

    /*$('#button6').click(function () {
        $('#button6').attr('disabled', true);
    });*/

    $('#button7').click(function () {
        $(".bg_modal4").css('display','flex');
        
        $("#newcollbutton").hide();
        $("#oldcollbutton").hide();
        $("#newcoll").hide();
        $("#coll").hide();
        $("#button8").css('display','inline');
        $("#button9").css('display','inline');

        $('#button8').click(function () {
            $("#button9").css('display','none');
            $("#newcollbutton").show();
            $("#newcoll").show();
        });

        $('#button9').click(function () {
            $("#button8").css('display','none');
            $("#oldcollbutton").show();
            $("#coll").show();
        });

        $('.close4').click(function () {
            $(".bg_modal4").css('display','none');
        });
    });

    
});

