from fastapi import FastAPI, HTTPException

app = FastAPI()

from model_training import text_preprocessing, bert_classifier

@app.post("/predict_sentiment")
async def predict_sentiment(text: str):
    if not text:
        raise HTTPException(status_code=400, detail="Metin boş olamaz.")

    preprocessed_text = text_preprocessing(text)
    sentiment_prediction = bert_classifier.predict(preprocessed_text)

    return {"sentiment": sentiment_prediction}
