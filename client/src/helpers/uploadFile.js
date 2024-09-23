export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8080/api/uploads', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            // Log error response for more info
            const errorResponse = await response.text();
            console.error('Upload failed:', errorResponse);
            throw new Error('File upload failed');
        }

        const responseData = await response.json();
        return responseData.fileUrl;
    } catch (error) {
        console.error('Error during file upload:', error.message);
        throw error; // Let the caller handle the error
    }
};
