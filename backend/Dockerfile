# Lambda con Python 3.12 (Amazon Linux 2023). Objetivo inicial: linux/amd64.
# El controlador ODBC es una dependencia nativa; por eso se empaqueta como imagen.
FROM public.ecr.aws/lambda/python:3.12

RUN dnf install -y unixODBC unixODBC-devel curl ca-certificates \
    && curl -fsSL https://packages.microsoft.com/config/rhel/9/prod.repo \
       -o /etc/yum.repos.d/microsoft-prod.repo \
    && ACCEPT_EULA=Y dnf install -y msodbcsql18 \
    && dnf clean all \
    && rm -rf /var/cache/dnf

COPY requirements.txt ${LAMBDA_TASK_ROOT}/requirements.txt
RUN pip install --no-cache-dir -r ${LAMBDA_TASK_ROOT}/requirements.txt

COPY src/ ${LAMBDA_TASK_ROOT}/
CMD ["lambda_function.handler"]
