export const mockHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#1a5f7a">
    <title>每日植物生长报告</title>
    <!-- 引入外部 CSS 文件 -->
    <link rel="stylesheet" href="http://117.72.12.143/css/style.css">
    <!-- 添加字体图标库 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- 添加谷歌字体 -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <div class="header-content">
                <div class="logo-container">
                    <i class="fas fa-seedling header-icon pulse"></i>
                </div>
                <div class="title-container">
                    <h1>植物生长监测每日报告</h1>
                    <p class="report-date">报告生成日期：<span id="report-date">2025-04-15</span></p>
                </div>
            </div>
        </header>

        <main>
            <section class="summary card">
                <div class="card-header">
                    <h2><i class="fas fa-clipboard-list"></i> 报告概览</h2>
                </div>
                <div class="card-body">
                    <div class="summary-content">
                        <div class="summary-main">
                            <div class="overall-assessment-badge status-good" id="overall-assessment-badge">良好</div>
                            <p id="report-summary">
                                根据多维数据分析，您月季当前状态评估为 **良好**，处于 **初花期**。核心诊断指标分析如下。
                            </p>
                        </div>
                        <div class="plant-avatar">
                        </div>
                    </div>
                </div>
            </section>

            <section class="highlights card">
                <div class="card-header">
                    <h2><i class="fas fa-star"></i> 今日要点</h2>
                </div>
                <div class="card-body">
                    <p id="daily-highlight">
                        植株整体健康状况良好，叶片和花朵均无明显病害或虫害迹象。
                    </p>
                </div>
            </section>

            <section class="metrics card">
                <div class="card-header">
                    <h2><i class="fas fa-tachometer-alt"></i> 关键指标</h2>
                </div>
                <div class="card-body">
                    <div class="metric-grid">
                        <div class="metric-item">
                            <div class="metric-icon health-icon">
                                <i class="fas fa-heartbeat"></i>
                            </div>
                            <div class="metric-info">
                                <h3>健康状态</h3>
                                <div class="metric-value status-good" id="health-status">良好</div>
                                <div class="metric-note" id="health-notes">主要发现：植株整体健康状况良好，叶片和花朵均无明显病害或虫害迹象。</div>
                            </div>
                        </div>
                        
                        <div class="metric-item">
                            <div class="metric-icon soil-icon">
                                <i class="fas fa-water"></i>
                            </div>
                            <div class="metric-info">
                                <h3>土壤湿度</h3>
                                <div class="metric-value status-normal" id="soil-humidity">偏干</div>
                                <div class="metric-note" id="soil-notes">土壤表面干燥呈浅褐色，可见少量细小杂草。结合知识库分析，土壤表面看起来偏干，可能需要浇水。</div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 0%;"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="metric-item">
                            <div class="metric-icon sun-icon">
                                <i class="fas fa-sun"></i>
                            </div>
                            <div class="metric-info">
                                <h3>光照印象</h3>
                                <div class="metric-value" id="lighting-impression">明亮散射光，无明显直射</div>
                                <div class="metric-note" id="lighting-notes">结合知识库分析，光照条件适宜，但需确保充足的光照以促进开花。</div>
                            </div>
                        </div>
                        
                        <div class="metric-item">
                            <div class="metric-icon temp-icon">
                                <i class="fas fa-temperature-high"></i>
                            </div>
                            <div class="metric-info">
                                <h3>空气温度</h3>
                                <div class="metric-value" id="air-temperature">未提供</div>
                                <div class="metric-note" id="temperature-notes">未提供</div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 0%;"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="metric-item">
                            <div class="metric-icon humidity-icon">
                                <i class="fas fa-tint"></i>
                            </div>
                            <div class="metric-info">
                                <h3>空气湿度</h3>
                                <div class="metric-value" id="air-humidity">适中</div>
                                <div class="metric-note" id="humidity-notes">叶面干燥表明空气湿度适中，但需注意保持适当的湿度以防止病害发生。</div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 50%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div class="grid-layout">
                <section class="suggestions card">
                    <div class="card-header">
                        <h2><i class="fas fa-lightbulb"></i> 养护建议</h2>
                    </div>
                    <div class="card-body">
                        <ul id="suggestion-list" class="suggestion-list">
                            <li class="suggestion-item">
                                <i class="fas fa-tint"></i>
                                <div class="suggestion-content">
                                    <h3 class="suggestion-title">精准浇水</h3>
                                    <p>鉴于土壤表面干燥，建议调整浇水策略：每次浇水需确保水渗透至盆底（可通过检查底孔是否有水流出判断），浇水频率调整为约2-3天一次，具体以表层土壤干燥情况为准。避免叶面长时间积水。</p>
                                </div>
                            </li>
                            <li class="suggestion-item">
                                <i class="fas fa-sun"></i>
                                <div class="suggestion-content">
                                    <h3 class="suggestion-title">环境调控</h3>
                                    <p>确保植株处于明亮散射光下，避免强烈直射阳光。若光照不足，可考虑在生长灯下补充光照4-6小时/天。</p>
                                </div>
                            </li>
                            <li class="suggestion-item">
                                <i class="fas fa-shield-alt"></i>
                                <div class="suggestion-content">
                                    <h3 class="suggestion-title">病害预防</h3>
                                    <p>尽管目前未见明显病害，但仍需定期检查叶片和花朵，一旦发现病斑或虫害迹象，立即采取相应措施。建议每两周喷施一次广谱杀菌剂，如代森锰锌，以预防潜在病害。</p>
                                </div>
                            </li>
                            <li class="suggestion-item">
                                <i class="fas fa-leaf"></i>
                                <div class="suggestion-content">
                                    <h3 class="suggestion-title">营养管理</h3>
                                    <p>目前暂无明显营养不良迹象，但在初花期可适当补充磷钾肥，促进花芽分化和花朵质量。建议使用平衡型液体肥料，按说明稀释后浇灌。</p>
                                </div>
                            </li>
                            <li class="suggestion-item">
                                <i class="fas fa-eye"></i>
                                <div class="suggestion-content">
                                    <h3 class="suggestion-title">后续监测</h3>
                                    <p>请持续关注植株的整体健康状况，特别是叶片和花朵的状态，系统将在下次报告中进行对比分析。</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </main>

        <footer>
            <div class="footer-content">
                <div class="footer-logo">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="footer-info">
                    <p>报告由 AI 辅助生成 &copy; 2024</p>
                    <p class="footer-note">智能植物养护管理系统</p>
                </div>
            </div>
        </footer>
    </div>

    <script>
        // 设置报告日期为当天
        document.getElementById('report-date').textContent = new Date().toLocaleDateString('zh-CN');
        
        // 设置状态颜色
        document.addEventListener('DOMContentLoaded', function() {
            // 预加载所有图片以避免图库中的闪烁
            const images = document.querySelectorAll('img');
            let loadedCount = 0;
            
            images.forEach(img => {
                if (img.complete) {
                    loadedCount++;
                } else {
                    img.addEventListener('load', () => {
                        loadedCount++;
                        if (loadedCount === images.length) {
                            document.body.classList.add('loaded');
                        }
                    });
                }
            });
            
            if (loadedCount === images.length) {
                document.body.classList.add('loaded');
            }
        });
    </script>
</body>
</html>
`