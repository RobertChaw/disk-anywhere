import SparkMD5 from "spark-md5";

self.onmessage = (e) => {
  const { chunkList }: { chunkList: Array<Blob> } = e.data;
  const spark = new SparkMD5.ArrayBuffer();
  let count = 0;

  function loadNext(index: number) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunkList[index]);
    reader.onload = (e) => {
      spark.append(e.target.result);
      count++;
      if (count < chunkList.length) {
        self.postMessage({
          percentage: (count / chunkList.length) * 100,
        });
        loadNext(count);
      } else {
        self.postMessage({
          percentage: 100,
          hash: spark.end(),
        });
        self.close();
      }
    };
  }
  loadNext(0);
};
