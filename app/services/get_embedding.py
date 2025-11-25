import torch
from transformers import AutoTokenizer, AutoModel

MODEL_NAME = "indobenchmark/indobert-base-p1"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)

# Gunakan GPU jika tersedia
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
model.eval()

def get_embedding(texts, batch_size=32, max_length=128):
    embeddings = []
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i+batch_size]
        tokens = tokenizer(batch_texts, return_tensors="pt", truncation=True,
                           padding=True, max_length=max_length).to(device)
        with torch.no_grad():
            outputs = model(**tokens)
        token_embeddings = outputs.last_hidden_state
        attention_mask = tokens['attention_mask'].unsqueeze(-1)
        summed = torch.sum(token_embeddings * attention_mask, dim=1)
        counts = attention_mask.sum(dim=1).clamp(min=1e-9)
        mean_vec = summed / counts
        embeddings.append(mean_vec.cpu())
    return torch.cat(embeddings, dim=0).cpu().tolist()

if __name__ == "__main__":
    sample_texts = ["Santai Indah Murah"]
    embs = get_embedding(sample_texts)
    print(embs)
    