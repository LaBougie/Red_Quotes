
    // In api.js file
    
    (function ($) {

      $('#new-quote-button').on('click', function (e) {
        e.preventDefault();
    
        $.ajax({
          method: 'GET',
          url: api_vars.root_url + 'wp/v2/posts/?filter[orderby]=rand&filter[posts_per_page]=1',
        })
          .done(function (data) {
    
            var slug = data[0].slug;
            var renderedPost = data.shift();
    
            $('.entry-title').html(renderedPost.title.rendered);
            $('.entry-content').html(renderedPost.content.rendered);
            $('.hentry').append(history.pushState(null, null, slug));
    
            if (renderedPost._qod_quote_source_url) {
              $('.source').html('<a href="' + renderedPost._qod_quote_source_url + '">' + renderedPost._qod_quote_source + '</a>');
            }
    
          })
      });
    
      //submit a quote
      $('#quote-submission-form').on('submit', function (e) {
        e.preventDefault();
    
        var title = $('#quote-author').val(),
          content = $('#quote-content').val(),
          quoteSource = $('#quote-source').val(),
          quoteSourceUrl = $('#quote-source-url').val();
    
        var data = {
          title: title,
          content: content,
          _qod_quote_source: quoteSource,
          _qod_quote_source_url: quoteSourceUrl,
          post_status: 'pending'
        };
    
        $.ajax({
          method: 'post',
          url: api_vars.root_url + 'wp/v2/posts',
          data: data,
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', api_vars.nonce);
          }
        }).done(function () {
          $('#quote-submission-form').slideUp();
          $('.submit-success-message').text(api_vars.success).slideDown();
        }).fail(function () {
          alert(api_vars.failure);
        });
    
      });
    
    }(jQuery));