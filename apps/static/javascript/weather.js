$( function() {
    $( "#datepicker" ).datepicker({
        onSelect: function(dateText) {
            $.post('./weather_data', {date: dateText}, function(data) {
                data = JSON.parse(data);
                $('#date').text(dateText); 
                $('#sunshine').text(data['sunshine'] + ' mins');
                $('#wind').text((0 + data['wind']).toFixed(2) + ' km/h');
            });
        }
    });
  } );
