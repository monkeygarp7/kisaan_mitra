import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models

# --------------------------------------------------
# DEVICE
# --------------------------------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# --------------------------------------------------
# TRANSFORMS
# --------------------------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# --------------------------------------------------
# DATASET
# --------------------------------------------------
dataset = datasets.ImageFolder(
    root="data/plantvillage dataset/color",
    transform=transform
)

# --------------------------------------------------
# 70% TRAIN / 20% VALIDATION / 10% TEST
# --------------------------------------------------
total_size = len(dataset)

train_size = int(0.70 * total_size)
val_size = int(0.20 * total_size)
test_size = total_size - train_size - val_size

# Fixed seed = same split every time
generator = torch.Generator().manual_seed(42)

train_dataset, val_dataset, test_dataset = random_split(
    dataset,
    [train_size, val_size, test_size],
    generator=generator
)

print("\n==============================")
print("DATASET SPLIT")
print("==============================")
print(f"Total images:      {total_size}")
print(f"Training images:   {len(train_dataset)} ({len(train_dataset) / total_size * 100:.1f}%)")
print(f"Validation images: {len(val_dataset)} ({len(val_dataset) / total_size * 100:.1f}%)")
print(f"Testing images:    {len(test_dataset)} ({len(test_dataset) / total_size * 100:.1f}%)")
print(f"Number of classes: {len(dataset.classes)}")
print("==============================")

# --------------------------------------------------
# DATA LOADERS
# --------------------------------------------------
train_loader = DataLoader(
    train_dataset,
    batch_size=32,
    shuffle=True
)

val_loader = DataLoader(
    val_dataset,
    batch_size=32,
    shuffle=False
)

test_loader = DataLoader(
    test_dataset,
    batch_size=32,
    shuffle=False
)

# --------------------------------------------------
# MODEL
# CURRENT BASELINE
# MobileNetV2 + Frozen Backbone + Linear Classifier
# --------------------------------------------------
model = models.mobilenet_v2(weights="IMAGENET1K_V1")

# Unfreeze the last 2 MobileNetV2 feature blocks
for param in model.features[-2:].parameters():
    param.requires_grad = True

num_classes = len(dataset.classes)

model.classifier = nn.Sequential(
    nn.Dropout(0.2),
    nn.Linear(model.last_channel, num_classes)
)

model = model.to(device)

print("\nModel classifier:")
print(model.classifier)

# --------------------------------------------------
# LOSS + OPTIMIZER
# CURRENT BASELINE
# --------------------------------------------------
criterion = nn.CrossEntropyLoss()

optimizer = torch.optim.AdamW(
    [
        {"params": model.features[-2:].parameters(), "lr": 0.0001},
        {"params": model.classifier.parameters(), "lr": 0.001}
    ],
    weight_decay=0.01
)
# --------------------------------------------------
# TRAINING
# --------------------------------------------------
num_epochs = 5

for epoch in range(num_epochs):

    # ------------------------------
    # TRAIN
    # ------------------------------
    model.train()

    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in train_loader:

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        running_loss += loss.item()

        _, predicted = torch.max(outputs, 1)

        total += labels.size(0)
        correct += (predicted == labels).sum().item()

    train_loss = running_loss / len(train_loader)
    train_acc = 100 * correct / total

    # ------------------------------
    # VALIDATION
    # ------------------------------
    model.eval()

    val_loss = 0.0
    val_correct = 0
    val_total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            loss = criterion(outputs, labels)

            val_loss += loss.item()

            _, predicted = torch.max(outputs, 1)

            val_total += labels.size(0)
            val_correct += (predicted == labels).sum().item()

    val_loss = val_loss / len(val_loader)
    val_acc = 100 * val_correct / val_total

    print(
        f"Epoch [{epoch + 1}/{num_epochs}] | "
        f"Train Loss: {train_loss:.4f} | "
        f"Train Acc: {train_acc:.2f}% | "
        f"Val Loss: {val_loss:.4f} | "
        f"Val Acc: {val_acc:.2f}%"
    )

# --------------------------------------------------
# FINAL TEST
# The test set is NOT used during training.
# --------------------------------------------------
model.eval()

test_correct = 0
test_total = 0

with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(device)
        labels = labels.to(device)

        outputs = model(images)

        _, predicted = torch.max(outputs, 1)

        test_total += labels.size(0)
        test_correct += (predicted == labels).sum().item()

test_acc = 100 * test_correct / test_total

# --------------------------------------------------
# FINAL RESULTS
# --------------------------------------------------
print("\n==============================")
print("FINAL RESULTS")
print("==============================")
print(f"Validation Accuracy: {val_acc:.2f}%")
print(f"Test Accuracy:       {test_acc:.2f}%")
print("==============================")

# --------------------------------------------------
# SAVE NEW MODEL
# IMPORTANT:
# This is a separate filename so your current
# backend model remains untouched.
# --------------------------------------------------
# --------------------------------------------------
# SAVE NEW MODEL
# --------------------------------------------------
torch.save(
    model.state_dict(),
    "crop_disease_model_mobilenetv2_linear_adamw_finetune.pth"
)

print(
    "New model saved as "
    "crop_disease_model_mobilenetv2_linear_adamw_finetune.pth"
)