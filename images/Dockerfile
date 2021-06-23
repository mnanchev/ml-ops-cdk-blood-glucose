FROM public.ecr.aws/lambda/python:3.8
RUN pip install pip && \
    pip install awswrangler && \
    pip install oauth2client && \
    pip install gspread && \
    pip install joblib && \
    pip install scikit-learn==0.23.2 && \
    pip install codeguru-profiler-agent
COPY app.py   ./
ADD models   models
CMD ["app.handler"]