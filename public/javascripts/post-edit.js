// find post edit form
let postEditForm = document.getElementById('postEditForm');
// add submit listener to post edit form
postEditForm.addEventListener('submit', function(event){
    // find length of uploaded images
    let imageUploads = document.getElementById('imageUpload').files.length;
    // find total number of existing images
    let existingImages = document.querySelectorAll('.imageDeleteCheckbox').length;
    // find total number of potential deletions from checked boxes
    let imageDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    // prevent form default behavior if amounts total greater than 4 images
    let newTotal = existingImages - imageDeletions + imageUploads
    if(existingImages - imageDeletions + imageUploads > 4){
        event.preventDefault();
        let removalAmt = newTotal - 4
        alert(`You need to remove at least ${removalAmt} (more) image${removalAmt === 1 ? '': 's'}!`);
    }
});