// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    //$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    renderCard(data[i]._id, data[i].title, data[i].teaser, data[i].link );
  }
});

function renderCard(id,title,teaser,link) {
  const articleDiv = $("#articleDiv");
  const card = $('<div class="card border-dark mb-3">');
  const cardHeader = $(`<div class="d-flex justify-content-between card-header">`)
  const articleTitle = $(`<div class="col-6"><h5><a href="${link}">${title}</a></h5></div>`);
  const saveButton = $(`<div class="col-6"><button class="btn btn-primary" type="button" id="saveArticle">Save Article</button></div>`);
  const cardBody = $(`<div class="card-body"><p data-id="${id}">${teaser}</p><button type="button" class="btn btn-info" id="addArticle" data-id="${id}" data-toggle="modal" data-target="#exampleModal">Article Notes</button></div>`);

  // render card...
  // inner to outer...
  cardHeader.append(articleTitle);
  cardHeader.append(saveButton);
  card.append(cardHeader);
  card.append(cardBody);
  articleDiv.append(card);
  
}

$("#scrapeBtn").on("click", function() {
  console.log("Scrape Button Clicked");
  $.ajax({
    method: "GET",
    url: "/scrapeNPR"})
    .then(function(data) {
      console.log(data);
    });

    // Reload Page...
    location.reload();
});

$("#deleteArticleBtn").on("click", function() {
  console.log("Delete Button Clicked");
  $.ajax({
    method: "GET",
    url: "/delete"})
    .then(function(data) {
      console.log(data);
    });

    // Reload Page...
    location.reload();
});

// If user clicks the article button then display the modal...
$(document).on("click", "#addArticle", function() {
  // 1. Get the _id
  var mongoId = $(this).attr("data-id");

  // 2. Clear any information that was already in the modal...
  $("#notes").empty();

  // Populate the modal with Note Information...
  $("#modalTitle").text(`Article Notes for #: ${mongoId}`);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + mongoId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title'>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

      // Add data-id and id attributes to already existing Modal Save btn...
      $("#save-note").attr("data-id", data._id);

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });

});

// When you click the savenote button
$(document).on("click", "#save-note", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
