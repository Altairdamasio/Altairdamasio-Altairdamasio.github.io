<!-- upload.php -->

<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $uploadDir = 'uploads/';
    $uploadFile = $uploadDir . basename($file['name']);

    if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
        echo json_encode(['url' => $uploadFile, 'name' => $file['name']]);
    } else {
        echo json_encode(['error' => 'Falha ao fazer upload do arquivo.']);
    }
} else {
    echo json_encode(['error' => 'Requisição inválida.']);
}
?>
