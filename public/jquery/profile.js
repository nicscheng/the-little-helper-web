


$(document).ready(function(){
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
    
    $('#button1').click(function () {
        $(".bg-modal").css('display','flex');

        $('.close0').click(function () {
            $(".bg-modal").css('display','none');
        });
    });

    $('#button4').click(function () {
        $(".bg_modal3").css('display','flex');

        $('.close3').click(function () {
            $(".bg_modal3").css('display','none');
        });
    });
    
});



$(document).ready(function(){

    $('.main-nav ul li').click(function() {

        $(this).addClass("active").siblings().removeClass('active');
    });
    
});

const button = document.querySelectorAll ('.main-nav ul li');
const tab = document.querySelectorAll('.tab');
    
function tabs(panelIndex){
    tab.forEach(function(node){
        node.style.display = 'none';
    });
    tab[panelIndex].style.display = 'block';
}

tabs(0);


$("#edit_profile").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['username']] = n['value']
    })


    var request = {
        "url" : `http://localhost:3000/api/users/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })

})




$(document).ready(function(){
    $('.venobox').venobox(); 
});



/*$(document).ready(function(){
    $('.delete-account').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');

        $.ajax({
            type: 'DELETE',
            url: '/profile/' + id,
            success: function(response){
                alert('Deleting Account');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        })
    })
})*/
