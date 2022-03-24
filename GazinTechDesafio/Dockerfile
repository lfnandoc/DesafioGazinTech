
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 5050
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs
WORKDIR /src
COPY ["GazinTechDesafio/GazinTechDesafio.csproj", "GazinTechDesafio/"]
RUN dotnet restore "GazinTechDesafio/GazinTechDesafio.csproj"
COPY . .
WORKDIR "/src/GazinTechDesafio"
RUN dotnet build "GazinTechDesafio.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GazinTechDesafio.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GazinTechDesafio.dll"]